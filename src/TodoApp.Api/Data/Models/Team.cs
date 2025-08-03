namespace TodoApp.Api.Data.Models;

public class Team
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    
    // Navigation properties
    public ICollection<TeamMembership> TeamMemberships { get; set; } = new List<TeamMembership>();
    public ICollection<Todo> Todos { get; set; } = new List<Todo>();
}