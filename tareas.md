### **Endpoints Principales:**

1. **Registro de usuarios** - **`/register`** - (POST)
2. **Login de usuarios** - **`/login`** - (POST)
3. **Perfil de usuario** - **`/user/profile`** - (GET)
4. **Modificación de datos del perfil** - **`/user/profile`** - (PUT)
5. **Creación de citas** - **`/user/appointments/create`** - (POST)
6. **Editar citas** - **`/user/appointments/{appointmentID}/edit`** - (PUT)
7. **Eliminación de citas** - **`/user/appointments/{appointmentID}/delete`** - (DELETE)
8. **Ver todas las citas como cliente** - **`/user/appointments`** - (GET)
9. **Ver citas con el usuario como tatuador** - **`/tattooist/appointments`** - (GET)
10. **Listar tatuadores** - **`/tattooists`** - (GET)

### **Endpoints Adicionales (Extras):**

1. **Ver todos los clientes registrados (super admin)** - **`/admin/users`** - (GET)
2. **Crear tatuadores (super admin)** - **`/admin/tattooists/create`** - (POST)
3. **Eliminar usuario del sistema (super admin)** - **`/admin/users/{userID}/delete`** - (DELETE)
4. **Ver una cita en detalle** - **`/appointments/{appointmentID}`** - (GET)
5. **Otorgar roles a los usuarios del sistema (super admin)** - **`/admin/users/{userID}/assign-role`** - (PUT)
6. **Validar la fecha de la cita** - **`/appointments/{appointmentID}/validate-date`** - (PUT)
7. **Añadir tipos de intervención (tattoo / piercing) a las citas** - **`/appointments/{appointmentID}/add-intervention`** - (PUT)



