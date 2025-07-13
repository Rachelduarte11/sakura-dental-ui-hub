import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Simular validación de credenciales
    if (email === 'admin@sakura.com' && password === 'admin123') {
      const user = {
        user_id: 1,
        username: 'admin',
        email: 'admin@sakura.com',
        is_active: true,
        last_login: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        role_id: 1,
        employee_id: 1,
      };

      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // JWT token simulado

      return NextResponse.json({
        user,
        token,
        message: 'Login exitoso',
      });
    }

    return NextResponse.json(
      { error: 'Credenciales inválidas' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 