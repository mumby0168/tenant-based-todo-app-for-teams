namespace TodoApp.Api.Data.Models;

public class TeamMembership
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid TeamId { get; set; }
    public TeamRole Role { get; set; }
    public DateTimeOffset JoinedAt { get; set; }
    
    // Navigation properties
    public User User { get; set; } = null!;
    public Team Team { get; set; } = null!;
}

public enum TeamRole
{
    Member = 0,
    Admin = 1,
    Owner = 2
}