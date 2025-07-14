import jsPDF from 'jspdf';
import type { Quotation, Patient } from '../utils/api-client';

export interface QuotationPDFData {
  quotation: Quotation;
  patient: Patient;
}

export class PDFService {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 20;
  }

  async generateQuotationPDF(data: QuotationPDFData): Promise<void> {
    const { quotation, patient } = data;

    // Reset document
    this.doc = new jsPDF();

    // Add header with logo and clinic info
    await this.addHeader();

    // Add title
    this.addTitle(quotation.quotationId);

    // Add patient and date info
    this.addPatientInfo(patient, quotation.createdAt);

    // Add services table (total is now included inside the table)
    await this.addServicesTable(quotation.items || []);

    // Add footer
    this.addFooter();

    // Download the PDF
    this.doc.save(`Cotizacion_${quotation.quotationId}_${patient.firstName}_${patient.lastName}.pdf`);
  }

  private async addHeader(): Promise<void> {
    try {
      // Load the Sakura logo
      const logoPath = '/iso-saku.png';
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = logoPath;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        // Add timeout to prevent hanging
        setTimeout(reject, 5000);
      });
      
      // Add logo image - positioned at top left with proper aspect ratio
      this.doc.addImage(img, 'PNG', this.margin, 10, 30, 30);
      
      // Add SAKURA DENTAL text next to logo
      this.doc.setFontSize(16);
      this.doc.setTextColor(220, 53, 69); // Sakura red color
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('SAKURA DENTAL', this.margin + 40, 22);

      // Add clinic subtitle
      this.doc.setFontSize(10);
      this.doc.setTextColor(100, 100, 100);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('Clínica Dental Especializada', this.margin + 40, 32);

    } catch (error) {
      console.warn('Could not load logo, using text fallback:', error);
      // Fallback to text logo
      this.doc.setFontSize(16);
      this.doc.setTextColor(220, 53, 69);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('SAKURA DENTAL', this.margin, 22);

      this.doc.setFontSize(10);
      this.doc.setTextColor(100, 100, 100);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('Clínica Dental Especializada', this.margin, 32);
    }

    // Add decorative line
    this.doc.setDrawColor(220, 53, 69);
    this.doc.setLineWidth(2);
    this.doc.line(this.margin, 38, this.pageWidth - this.margin, 38);
  }

  private addTitle(quotationId?: number): void {
    this.doc.setFontSize(18);
    this.doc.setTextColor(80, 80, 80);
    this.doc.setFont('helvetica', 'bold');
    
    const title = quotationId ? `Cotización #${quotationId}` : 'Cotización';
    const titleWidth = this.doc.getTextWidth(title);
    const xPosition = (this.pageWidth - titleWidth) / 2;
    
    this.doc.text(title, xPosition, 55);
  }

  private addPatientInfo(patient: Patient, createdAt?: string): void {
    const startY = 70;
    let yPosition = startY;

    // Patient name
    if (patient.firstName && patient.lastName) {
      this.addPatientInfoLine('Paciente:', `${patient.firstName} ${patient.lastName}`, yPosition);
      yPosition += 12;
    }

    // Date
    if (createdAt) {
      const date = new Date(createdAt);
      const formattedDate = date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      this.addPatientInfoLine('Fecha:', formattedDate, yPosition);
      yPosition += 12;
    }

    // Phone
    if (patient.phone) {
      this.addPatientInfoLine('Teléfono:', patient.phone, yPosition);
      yPosition += 12;
    }

    // Email
    if (patient.email) {
      this.addPatientInfoLine('Email:', patient.email, yPosition);
      yPosition += 12;
    }

    // DNI
    if (patient.dni) {
      this.addPatientInfoLine('DNI:', patient.dni, yPosition);
    }
  }

  private addPatientInfoLine(label: string, value: string, yPosition: number): void {
    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 0, 0);
    
    // Add label (bold)
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(label, this.margin, yPosition);
    
    // Add value (normal)
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(value, this.margin + 30, yPosition);
  }

  private addServicesTable(items: Array<{
    serviceName?: string;
    serviceDescription?: string;
    subtotal?: number;
    unitPrice?: number;
    quantity: number;
  }>): Promise<number> {
    return new Promise((resolve) => {
      const startY = 125;
      let currentY = startY;

      // Table header
      this.doc.setFillColor(80, 80, 80); // Grey header
      this.doc.rect(this.margin, currentY, this.pageWidth - 2 * this.margin, 15, 'F');

      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Servicio dental', this.margin + 2, currentY + 10);
      this.doc.text('Precio unit.', this.margin + 80, currentY + 10);
      this.doc.text('Cant.', this.margin + 120, currentY + 10);
      this.doc.text('Total', this.margin + 140, currentY + 10);

      currentY += 15;

      // Table rows
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(10);

      items.forEach((item, index) => {
        const rowHeight = 20;
        
        // Check if we need a new page (leave space for total row and footer)
        if (currentY + rowHeight + 20 + 35 > this.pageHeight - 20) {
          // Finish current table
          this.doc.setDrawColor(200, 200, 200);
          this.doc.setLineWidth(0.5);
          this.doc.rect(this.margin, startY, this.pageWidth - 2 * this.margin, currentY - startY);
          
          // Add footer to current page
          this.addFooter();
          
          // Create new page
          this.doc.addPage();
          
          // Reset position and add header to new page
          currentY = 20;
          const newStartY = currentY;
          
          // Add table header on new page
          this.doc.setFillColor(80, 80, 80);
          this.doc.rect(this.margin, currentY, this.pageWidth - 2 * this.margin, 15, 'F');
          
          this.doc.setTextColor(255, 255, 255);
          this.doc.setFontSize(10);
          this.doc.setFont('helvetica', 'bold');
          this.doc.text('Servicio dental', this.margin + 2, currentY + 10);
          this.doc.text('Precio unit.', this.margin + 80, currentY + 10);
          this.doc.text('Cant.', this.margin + 120, currentY + 10);
          this.doc.text('Total', this.margin + 140, currentY + 10);
          
          currentY += 15;
        }
        
        // Alternate row colors
        if (index % 2 === 0) {
          this.doc.setFillColor(248, 249, 250);
          this.doc.rect(this.margin, currentY, this.pageWidth - 2 * this.margin, rowHeight, 'F');
        }

        // Service name
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(9);
        this.doc.setTextColor(0, 0, 0);
        const serviceName = item.serviceName || 'Servicio';
        // Show complete service name
        this.doc.text('• ' + serviceName, this.margin + 2, currentY + 8);

        // Service description (if available)
        if (item.serviceDescription) {
          this.doc.setFont('helvetica', 'normal');
          this.doc.setFontSize(8);
          // Show complete description with text wrapping if needed
          const maxWidth = 70; // Reduced width for description
          const lines = this.doc.splitTextToSize(item.serviceDescription, maxWidth);
          this.doc.text(lines, this.margin + 2, currentY + 17);
        }

        // Unit price
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(9);
        this.doc.setTextColor(0, 0, 0);
        const unitPrice = `S/ ${item.unitPrice?.toFixed(2) || '0.00'}`;
        this.doc.text(unitPrice, this.margin + 80, currentY + 12);

        // Quantity
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(9);
        this.doc.setTextColor(0, 0, 0);
        this.doc.text(item.quantity.toString(), this.margin + 120, currentY + 12);

        // Total (unit price * quantity)
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(9);
        this.doc.setTextColor(80, 80, 80);
        const itemTotal = (item.unitPrice || 0) * item.quantity;
        const totalText = `S/ ${itemTotal.toFixed(2)}`;
        this.doc.text(totalText, this.margin + 140, currentY + 12);

        currentY += rowHeight;
        this.doc.setTextColor(0, 0, 0);
      });

      // Add total row inside the table
      const totalRowY = currentY;
      const totalRowHeight = 20;
      
      // Total row background
      this.doc.setFillColor(80, 80, 80);
      this.doc.rect(this.margin, totalRowY, this.pageWidth - 2 * this.margin, totalRowHeight, 'F');
      
      // Total text
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('TOTAL COTIZACIÓN', this.margin + 5, totalRowY + 13);
      
      // Calculate total amount
      const totalAmount = items.reduce((sum, item) => sum + ((item.unitPrice || 0) * item.quantity), 0);
      this.doc.text(`S/ ${totalAmount.toFixed(2)}`, this.margin + 140, totalRowY + 13);
      
      currentY += totalRowHeight;

      // Table border
      this.doc.setDrawColor(200, 200, 200);
      this.doc.setLineWidth(0.5);
      this.doc.rect(this.margin, startY, this.pageWidth - 2 * this.margin, currentY - startY);
      
      resolve(currentY);
    });
  }

  async generateQuotationPDFBlob(data: QuotationPDFData): Promise<Blob> {
    const { quotation, patient } = data;
    
    // Reset document
    this.doc = new jsPDF();
    
    // Add all content (same as current method)
    await this.addHeader();
    this.addTitle(quotation.quotationId);
    this.addPatientInfo(patient, quotation.createdAt);
    await this.addServicesTable(quotation.items || []);
    this.addFooter();
    
    // Return as blob instead of downloading
    const pdfBlob = this.doc.output('blob');
    return pdfBlob;
  }


  private addFooter(): void {
    const yPosition = this.pageHeight - 35;

    // Footer background
    this.doc.setFillColor(80, 80, 80);
    this.doc.rect(0, yPosition, this.pageWidth, 35, 'F');

    // Contact information header
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Información de contacto', this.margin, yPosition + 10);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7);
    
    // Left column
    this.addFooterText('Dirección: Av. Principal 123, Lima, Perú', this.margin, yPosition + 18);
    this.addFooterText('Teléfono: +51 983 505 577', this.margin, yPosition + 26);

    // Right column
    this.addFooterText('Web: www.sakuradental.com', this.pageWidth - 90, yPosition + 18);
    this.addFooterText('Email: info@sakuradental.com', this.pageWidth - 90, yPosition + 26);
  }

  private addFooterText(text: string, x: number, y: number): void {
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(7);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(text, x, y);
  }
}

export const pdfService = new PDFService(); 