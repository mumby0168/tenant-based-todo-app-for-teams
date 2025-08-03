namespace TodoApp.Api.Data.Models;

public class Todo
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public DateTimeOffset? DueDate { get; set; }
    public TodoPriority Priority { get; set; }
    public Guid TeamId { get; set; }
    public Guid CreatedById { get; set; }
    public Guid? AssignedToId { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public DateTimeOffset? CompletedAt { get; set; }
    
    // Navigation properties
    public Team Team { get; set; } = null!;
    public User CreatedBy { get; set; } = null!;
    public User? AssignedTo { get; set; }
}

public enum TodoPriority
{
    Low = 0,
    Normal = 1,
    High = 2,
    Urgent = 3
}