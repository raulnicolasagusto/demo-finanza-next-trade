# 📊 DEMO FINANZA NEXT - DOCUMENTACIÓN BASE DEL PROYECTO

## 🏗️ ARQUITECTURA Y STACK TECNOLÓGICO

### **Framework y Versiones**
- **Next.js**: 15.4.5 (App Router)
- **React**: 19.1.0
- **TypeScript**: ^5 (strict mode habilitado)
- **Tailwind CSS**: ^4
- **Clerk Auth**: ^6.28.0
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ^8.x ODM para MongoDB
- **Node.js**: Compatible con ES2017+

### **Herramientas de Desarrollo**
- **Turbopack**: Habilitado para desarrollo rápido
- **ESLint**: ^9 con configuración Next.js
- **PostCSS**: ^4 para Tailwind

## 🔐 CONFIGURACIÓN DE AUTENTICACIÓN (CLERK V6)

### **Variables de Entorno (.env.local)**
```env
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# URLs de redirección
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# MongoDB Configuration
MONGODB_URI=mongodb+srv://raulnicolasagusto:xqHUw4hhhs0uf6EG@cluster-finance-app.zavrbjy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-finance-app
```

### **Sintaxis Importante Clerk v6**
```typescript
// ✅ CORRECTO - Usar async/await
export default async function Page() {
  const { userId } = await auth();
  // ...
}

// ✅ CORRECTO - Middleware
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});
```

## 🗄️ CONFIGURACIÓN DE BASE DE DATOS (MONGODB)

### **Conexión a MongoDB**
- **Cluster**: Cluster-finance-app
- **Usuario**: raulnicolasagusto
- **Conexión**: Optimizada con cache para desarrollo
- **ODM**: Mongoose para modelado de datos

### **Estructura de Archivos de Base de Datos**
```
src/api/
├── db/
│   └── connection.ts          # Conexión optimizada a MongoDB
└── models/
    ├── index.ts               # Exportaciones centralizadas
    ├── user.models.ts         # Modelo de usuarios
    └── expense.models.ts      # Modelo de gastos
```

### **Modelos Implementados**

#### **User Model (user.models.ts)**
```typescript
interface IUser {
  user_id: string;        // Clerk user ID (PRIMARY KEY)
  email: string;          // Email único
  first_name: string;     // Nombre
  last_name: string;      // Apellido
  image_perfil?: string;  // URL de imagen de perfil
  createdAt: Date;        // Timestamp automático
  updatedAt: Date;        // Timestamp automático
}
```

#### **Expense Model (expense.models.ts)**
```typescript
interface IExpense {
  expense_id: string;                                    // ID único del gasto
  user_id: string;                                      // Clerk user ID
  expense_name: string;                                 // Nombre del gasto
  expense_amount: number;                               // Monto del gasto
  expense_category: 'Comida' | 'Super Mercado' | 'Delivery';  // Categoría
  payment_method: 'Debito' | 'Credito' | 'Efectivo';   // Método de pago
  createdAt: Date;                                      // Timestamp automático
  updatedAt: Date;                                      // Timestamp automático
}
```

#### **🆕 Income Model (income.models.ts)**
```typescript
interface IIncome {
  income_id: string;        // ID único del ingreso
  user_id: string;          // Clerk user ID
  income_type: string;      // Tipo/descripción del ingreso
  income_amount: number;    // Monto del ingreso
  createdAt: Date;          // Timestamp automático
  updatedAt: Date;          // Timestamp automático
}
```

#### **🆕 Transaction Union Type**
```typescript
type Transaction = (Expense & { type: 'expense' }) | (Income & { type: 'income' });
```

### **Características de los Modelos**
- **Índices optimizados** para consultas rápidas
- **Validaciones automáticas** con Mongoose
- **Timestamps automáticos** (createdAt/updatedAt)
- **Tipos TypeScript** para seguridad de tipos
- **Enums estrictos** para categorías y métodos de pago

### **API de Prueba**
- **Endpoint**: `/api/test-db`
- **GET**: Verifica conexión y cuenta documentos
- **POST**: Crea usuarios de prueba
- **Uso**: Verificar que MongoDB esté funcionando

## 🗂️ ESTRUCTURA DE ARCHIVOS

```
src/
├── api/
│   ├── db/
│   │   └── connection.ts       # Conexión optimizada a MongoDB
│   └── models/
│       ├── index.ts            # Exportaciones centralizadas
│       ├── user.models.ts      # Modelo de usuarios
│       └── expense.models.ts   # Modelo de gastos
├── app/
│   ├── layout.tsx              # ClerkProvider + configuración global
│   ├── page.tsx                # Landing page con redirección inteligente
│   ├── globals.css             # Estilos globales + Tailwind
│   ├── api/
│   │   └── test-db/
│   │       └── route.ts        # API de prueba para MongoDB
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard protegido con modal de gastos
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx        # Página de login de Clerk
│   └── sign-up/
│       └── [[...sign-up]]/
│           └── page.tsx        # Página de registro de Clerk
├── components/
│   ├── DashboardLayout.tsx     # Layout del dashboard
│   ├── Sidebar.tsx             # Sidebar de navegación
│   └── AddExpenseModal.tsx     # Modal para agregar gastos
└── middleware.ts               # Protección de rutas
```

## 🛡️ PROTECCIÓN DE RUTAS

### **Middleware Configurado**
- **Rutas protegidas**: `/dashboard(.*)` 
- **Middleware**: `clerkMiddleware` con `createRouteMatcher`
- **Lógica**: Usuarios autenticados → `/dashboard`, no autenticados → `/sign-in`

### **Configuración del Matcher**
```typescript
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

## 🎨 DISEÑO Y UI/UX

### **Tema Visual**
- **Colores principales**: Azul/Indigo (`blue-600`, `indigo-100`)
- **Tipografía**: Geist Sans y Geist Mono
- **Gradientes**: `bg-gradient-to-br from-blue-50 to-indigo-100`
- **Responsive**: Mobile-first con Tailwind

### **Componentes de Clerk Utilizados**
- `UserButton`: Botón de usuario en dashboard
- `SignInButton` / `SignUpButton`: Botones de autenticación
- `SignedIn` / `SignedOut`: Componentes condicionales

## ⚙️ SCRIPTS Y COMANDOS

```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

## 🔧 CONFIGURACIONES IMPORTANTES

### **TypeScript (tsconfig.json)**
- **Target**: ES2017
- **Strict mode**: Habilitado
- **Path mapping**: `@/*` → `./src/*`
- **JSX**: preserve

### **Next.js (next.config.ts)**
- Configuración básica sin modificaciones especiales
- Compatible con Turbopack

## 📋 CHECKLIST PARA NUEVAS FUNCIONALIDADES

### **Antes de Desarrollar**
- [ ] Verificar que el servidor esté corriendo (`npm run dev`)
- [ ] Confirmar que las variables de entorno estén configuradas
- [ ] Revisar que la autenticación funcione correctamente

### **Al Agregar Nuevas Rutas**
- [ ] Decidir si la ruta necesita protección
- [ ] Actualizar `middleware.ts` si es necesario
- [ ] Usar `async/await` con `auth()` si se necesita autenticación
- [ ] Mantener consistencia en el diseño con Tailwind

### **Al Agregar Dependencias**
- [ ] Verificar compatibilidad con Next.js 15
- [ ] Verificar compatibilidad con React 19
- [ ] Actualizar esta documentación si es relevante

## 🚀 ESTADO ACTUAL DEL PROYECTO

✅ **Completado:**
- Autenticación completa con Clerk v6
- Protección de rutas con middleware
- Landing page responsive
- Dashboard básico con modal de gastos
- Páginas de sign-in/sign-up
- Configuración de desarrollo con Turbopack
- **Base de datos MongoDB configurada**
- **Modelos User y Expense implementados**
- **Conexión optimizada a MongoDB**
- **Modal "Agregar Gasto" funcional**
- **API de prueba para verificar BD**
- **🆕 Modelo Income implementado para ingresos**
- **🆕 Tabla de transacciones unificada (ExpensesTable.tsx)**
- **🆕 Integración completa de gastos e ingresos en una sola vista**
- **🆕 API /api/incomes para gestión de ingresos**
- **🆕 Validaciones de formulario en AddExpenseModal**

### **🆕 NUEVAS FUNCIONALIDADES IMPLEMENTADAS (Enero 2025)**

#### **📊 Sistema de Transacciones Unificado**
- **ExpensesTable.tsx**: Tabla que muestra gastos e ingresos juntos
- **Diferenciación visual**: Gastos en rojo, ingresos en verde
- **Búsqueda unificada**: Busca en todos los campos de ambos tipos
- **Paginación inteligente**: Maneja la lista combinada
- **Acciones CRUD**: Editar/eliminar para ambos tipos

#### **💰 Gestión de Ingresos**
- **Modelo Income**: Estructura para ingresos con `income_type` y `income_amount`
- **API /api/incomes**: Endpoints GET, POST, PUT, DELETE
- **Integración en tabla**: Los ingresos se muestran junto a gastos
- **Validaciones**: Campos requeridos y tipos correctos

#### **🔍 Funcionalidades de la Tabla Unificada**
- **Columnas dinámicas**:
  - Movimiento: `expense_name` para gastos, `income_type` para ingresos
  - Monto: Rojo para gastos, verde para ingresos
  - Categoría: Con icono para gastos, "-" para ingresos
  - Método de Pago: Con icono para gastos, "-" para ingresos
  - Fecha: `createdAt` para ambos
  - Acciones: Editar/Eliminar funcionales

#### **✅ Validaciones de Formulario (AddExpenseModal)**
- **Nombre del gasto**: Máximo 40 caracteres
  - Advertencia visual con borde rojo
  - Contador de caracteres en tiempo real
  - Botón deshabilitado si excede límite
- **Monto del gasto**: Máximo 10 números
  - Validación inteligente que cuenta solo números
  - Advertencia visual y contador
  - Botón deshabilitado si excede límite

#### **🔧 Mejoras Técnicas**
- **Tipos TypeScript**: Union type `Transaction` para gastos e ingresos
- **Fetch concurrente**: `fetchAllData()` obtiene ambos tipos simultáneamente
- **Estado unificado**: `transactions` combina gastos e ingresos
- **Renderizado condicional**: Lógica para mostrar datos según tipo
- **Manejo de errores**: Validaciones robustas en frontend y backend

🔄 **Listo para Expansión:**
- API routes para operaciones CRUD completas
- Integración de gastos con la base de datos
- Dashboards con datos reales de MongoDB
- Reportes y análisis financieros
- Funcionalidades avanzadas de categorización
- **🆕 Modal para agregar ingresos**
- **🆕 Edición inline de transacciones**
- **🆕 Filtros avanzados por tipo, categoría, fecha**
- **🆕 Exportación de datos**
- **🆕 Gráficos y estadísticas**

## 🚨 REGLAS CRÍTICAS DE DESARROLLO

### **⚠️ INTEGRIDAD DEL CÓDIGO - MÁXIMA PRIORIDAD**

1. **🔒 NO ROMPER CÓDIGO EXISTENTE**
   - NUNCA modificar código que funciona correctamente
   - NUNCA eliminar funcionalidades existentes sin autorización explícita
   - NUNCA cambiar configuraciones que ya están funcionando

2. **🎯 SOLO CREAR LO SOLICITADO**
   - Crear únicamente las funcionalidades específicamente pedidas
   - NO agregar código "extra" o "mejoras" no solicitadas
   - NO modificar archivos que no están relacionados con la tarea

3. **📋 ANTES DE CADA MODIFICACIÓN**
   - Leer y entender completamente el código existente
   - Identificar exactamente qué se necesita crear/modificar
   - Verificar que los cambios no afecten funcionalidades existentes
   - Hacer cambios mínimos y precisos

4. **✅ VERIFICACIÓN POST-CAMBIOS**
   - Confirmar que el servidor sigue funcionando
   - Verificar que la autenticación sigue operativa
   - Probar que las rutas existentes siguen funcionando

### **🎯 PRINCIPIO FUNDAMENTAL**
**"SOLO HACER LO QUE SE PIDE, NADA MÁS, NADA MENOS"**

## 📞 NOTAS IMPORTANTES

1. **Siempre usar `async/await`** con funciones de Clerk v6
2. **Mantener consistencia** en el diseño azul/indigo
3. **Verificar middleware** al agregar nuevas rutas protegidas
4. **Documentar cambios** importantes en este archivo
5. **Probar autenticación** después de cada cambio significativo
6. **🔴 RESPETAR LAS REGLAS CRÍTICAS** en cada desarrollo

---

**Última actualización**: Agosto 2025 - Sistema de transacciones unificado implementado
**Versión del proyecto**: 0.3.0
**Estado**: Sistema completo de gastos e ingresos con validaciones ✅