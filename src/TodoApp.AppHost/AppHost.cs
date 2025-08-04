var builder = DistributedApplication.CreateBuilder(args);

// Step 1: Add PostgreSQL database (replaces Docker Compose postgres service)
var postgres = builder.AddPostgres("postgres")
    .WithLifetime(ContainerLifetime.Persistent)  // Keep data between restarts
    .WithDataVolume();  // Persistent data storage

var database = postgres.AddDatabase("todoapp-db");

builder.Build().Run();
