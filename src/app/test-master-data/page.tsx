'use client';

import React, { useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useMasterData } from '@/shared/hooks/useMasterData';
import { Loader2 } from 'lucide-react';

const TestMasterDataPage: React.FC = () => {
  const {
    districts,
    genders,
    documentTypes,
    jobTitles,
    isLoading,
    error,
    loadAllMasterData,
    loadDistricts,
    loadGenders,
    loadDocumentTypes,
    loadJobTitles,
    clearError,
    isDataLoaded
  } = useMasterData();

  useEffect(() => {
    console.log('🧪 TestMasterDataPage: Componente montado');
  }, []);

  const handleLoadAll = async () => {
    console.log('🧪 TestMasterDataPage: Cargando todos los datos...');
    try {
      await loadAllMasterData();
    } catch (error) {
      console.error('❌ TestMasterDataPage: Error cargando todos los datos:', error);
    }
  };

  const handleLoadDistricts = async () => {
    console.log('🧪 TestMasterDataPage: Cargando distritos...');
    try {
      await loadDistricts();
    } catch (error) {
      console.error('❌ TestMasterDataPage: Error cargando distritos:', error);
    }
  };

  const handleLoadGenders = async () => {
    console.log('🧪 TestMasterDataPage: Cargando géneros...');
    try {
      await loadGenders();
    } catch (error) {
      console.error('❌ TestMasterDataPage: Error cargando géneros:', error);
    }
  };

  const handleLoadDocumentTypes = async () => {
    console.log('🧪 TestMasterDataPage: Cargando tipos de documento...');
    try {
      await loadDocumentTypes();
    } catch (error) {
      console.error('❌ TestMasterDataPage: Error cargando tipos de documento:', error);
    }
  };

  const handleLoadJobTitles = async () => {
    console.log('🧪 TestMasterDataPage: Cargando cargos...');
    try {
      await loadJobTitles();
    } catch (error) {
      console.error('❌ TestMasterDataPage: Error cargando cargos:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Test Master Data Hook</h1>
        
        {/* Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Estado del Hook</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Cargando:</p>
                <p className="text-lg font-semibold">{isLoading ? 'Sí' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Datos Cargados:</p>
                <p className="text-lg font-semibold">{isDataLoaded ? 'Sí' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Error:</p>
                <p className="text-lg font-semibold text-red-600">{error || 'Ninguno'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={handleLoadAll}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Cargando...
                  </>
                ) : (
                  'Cargar Todos'
                )}
              </Button>
              <Button 
                onClick={handleLoadDistricts}
                disabled={isLoading}
                variant="outline"
              >
                Cargar Distritos
              </Button>
              <Button 
                onClick={handleLoadGenders}
                disabled={isLoading}
                variant="outline"
              >
                Cargar Géneros
              </Button>
              <Button 
                onClick={handleLoadDocumentTypes}
                disabled={isLoading}
                variant="outline"
              >
                Cargar Tipos de Documento
              </Button>
              <Button 
                onClick={handleLoadJobTitles}
                disabled={isLoading}
                variant="outline"
              >
                Cargar Cargos
              </Button>
              <Button 
                onClick={clearError}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Limpiar Error
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Districts */}
          <Card>
            <CardHeader>
              <CardTitle>Distritos ({districts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {districts.length === 0 ? (
                <p className="text-gray-500">No hay distritos cargados</p>
              ) : (
                <div className="space-y-2">
                  {districts.slice(0, 5).map((district) => (
                    <div key={district.districtId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{district.name}</span>
                      <span className="text-sm text-gray-500">ID: {district.districtId}</span>
                    </div>
                  ))}
                  {districts.length > 5 && (
                    <p className="text-sm text-gray-500">... y {districts.length - 5} más</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Genders */}
          <Card>
            <CardHeader>
              <CardTitle>Géneros ({genders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {genders.length === 0 ? (
                <p className="text-gray-500">No hay géneros cargados</p>
              ) : (
                <div className="space-y-2">
                  {genders.map((gender) => (
                    <div key={gender.genderId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{gender.name}</span>
                      <span className="text-sm text-gray-500">{gender.code}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Types */}
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Documento ({documentTypes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {documentTypes.length === 0 ? (
                <p className="text-gray-500">No hay tipos de documento cargados</p>
              ) : (
                <div className="space-y-2">
                  {documentTypes.map((docType) => (
                    <div key={docType.documentTypeId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{docType.name}</span>
                      <span className="text-sm text-gray-500">{docType.code}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Titles */}
          <Card>
            <CardHeader>
              <CardTitle>Cargos ({jobTitles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {jobTitles.length === 0 ? (
                <p className="text-gray-500">No hay cargos cargados</p>
              ) : (
                <div className="space-y-2">
                  {jobTitles.map((jobTitle) => (
                    <div key={jobTitle.job_title_id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{jobTitle.name}</span>
                      <span className="text-sm text-gray-500">ID: {jobTitle.job_title_id}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestMasterDataPage; 