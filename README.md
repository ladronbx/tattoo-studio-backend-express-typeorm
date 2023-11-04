![Diagrama](img-readme/reverse-engineer.png)

## API Endpoints for User Management

<details>
<summary>1. `/register`</summary>

- **Description**: Registers a new user (client) in the database.
- **Access**: Public.
- **Validations**: Checks the validity of the provided information (name, email, password, phone number) before registering the user.
</details>

<details>
<summary>2. `/login`</summary>

- **Description**: Logs in for an existing user.
- **Access**: Public.
- **Validations**: Verifies the user's credentials and issues a JWT token if the credentials are correct.
</details>

<details>
<summary>3. `/profile`</summary>

- **Description**: Retrieves data of the logged-in user.
- **Access**: Only for authenticated users.
- **Validations**: Verifies the JWT token to obtain the current user's profile.
</details>

<details>
<summary>4. `/users`</summary>

- **Description**: Retrieves all users (clients) with pagination.
- **Access**: Only for superusers.
- **Validations**: Requires superuser permissions to access.
</details>

<details>
<summary>5. `/updateUser`</summary>

- **Description**: Updates the data of an existing user.
- **Access**: Only for authenticated users.
- **Validations**: Verifies the updates and validates the data to be modified.
</details>

## API Endpoints for Appointment Management

<details>
<summary>1. `/createAppointment`</summary>

- **Description**: Creates a new appointment if the date is in the future and the artist is available.
- **Access**: Only for authenticated users.
- **Validations**: Verifies the validity of the date, time slot, artist's email, and service name to create the appointment.
</details>

<details>
<summary>2. `/myCalendarAsArtist`</summary>

- **Description**: Displays all appointments for a specific artist (logged in as an artist).
- **Access**: Only for authenticated users with the artist role.
- **Validations**: Access to appointments related to the ID of the authenticated artist.
</details>

<details>
<summary>3. `/deleteAppointment`</summary>

- **Description**: Deletes an appointment by its ID.
- **Access**: Only for authenticated users.
- **Validations**: Verifies the ID of the appointment and its ownership by the authenticated user.
</details>

<details>
<summary>4. `/getAllAppointmentsCalendar`</summary>

- **Description**: Retrieves all appointments for agenda display (with pagination).
- **Access**: Only for superusers.
- **Validations**: Requires superuser permissions to access.
</details>

<details>
<summary>5. `/getAllAppointmentsCalendarDetails`</summary>

- **Description**: Retrieves all appointments in detail for agenda display (including details) with pagination.
- **Access**: Only for superusers.
- **Validations**: Requires superuser permissions to access.
</details>

<details>
<summary>6. `/getAllMyAppointments`</summary>

- **Description**: Retrieves all appointments for a specific user (logged in as a client).
- **Access**: Only for authenticated users.
- **Validations**: Verifies the ownership of the authenticated user to the appointments.
</details>

<details>
<summary>7. `/updateAppointment`</summary>

- **Description**: Updates an existing appointment if the date is in the future and the artist is available.
- **Access**: Only for authenticated users.
- **Validations**: Verifies the validity of the date, time slot, artist's email, and service name to update the appointment.
</details>