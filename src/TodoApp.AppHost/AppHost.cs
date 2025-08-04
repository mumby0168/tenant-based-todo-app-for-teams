var builder = DistributedApplication.CreateBuilder(args);

// Step 1: Add PostgreSQL database (replaces Docker Compose postgres service)
var postgres = builder.AddPostgres("postgres")
    .WithLifetime(ContainerLifetime.Persistent)  // Keep data between restarts
    .WithDataVolume();  // Persistent data storage

var database = postgres.AddDatabase("todoapp-db");

// Step 2: Add MailDev for email testing (replaces Docker Compose maildev service)
var maildev = builder.AddContainer("maildev", "maildev/maildev")
    .WithHttpEndpoint(port: 1090, targetPort: 1080, name: "web")
    .WithEndpoint(port: 1030, targetPort: 1025, name: "smtp");

// Step 3: Add API project (replaces Docker Compose api-dev service)
var api = builder.AddProject<Projects.TodoApp_Api>("api")
    .WithReference(database)  // Automatically injects connection string!
    .WithReference(maildev.GetEndpoint("smtp"))  // Email configuration
    .WaitFor(postgres)  // Wait for database to be ready
    .WithExternalHttpEndpoints();  // Allow external access

builder.Build().Run();
