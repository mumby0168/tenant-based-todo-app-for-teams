namespace TodoApp.Api.Data.Models;

public class TodoList
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public Guid TeamId { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
    
    // Navigation properties
    public Team Team { get; set; } = null!;
}