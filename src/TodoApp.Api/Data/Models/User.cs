namespace TodoApp.Api.Data.Models;

public class User
{
    public Guid Id { get; set; }
    public required string Email { get; set; }
    public required string Name { get; set; }
    public bool IsEmailVerified { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public DateTimeOffset? LastLoginAt { get; set; }
    
    // Navigation properties
    public ICollection<TeamMembership> TeamMemberships { get; set; } = new List<TeamMembership>();
    public ICollection<Todo> CreatedTodos { get; set; } = new List<Todo>();
    public ICollection<Todo> AssignedTodos { get; set; } = new List<Todo>();
}