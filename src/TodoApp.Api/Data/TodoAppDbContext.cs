using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data.Models;

namespace TodoApp.Api.Data;

public class TodoAppDbContext : DbContext
{
    public TodoAppDbContext(DbContextOptions<TodoAppDbContext> options) : base(options)
    {
    }
    
    public DbSet<User> Users { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<TeamMembership> TeamMemberships { get; set; }
    public DbSet<Todo> Todos { get; set; }
    public DbSet<TodoList> TodoLists { get; set; }
    public DbSet<VerificationToken> VerificationTokens { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // User entity configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(256);
            entity.Property(u => u.Name).IsRequired().HasMaxLength(256);
            entity.HasIndex(u => u.Email).IsUnique();
            
            entity.Property(u => u.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(u => u.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });
        
        // Team entity configuration
        modelBuilder.Entity<Team>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Name).IsRequired().HasMaxLength(256);
            
            entity.Property(t => t.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(t => t.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });
        
        // TeamMembership entity configuration
        modelBuilder.Entity<TeamMembership>(entity =>
        {
            entity.HasKey(tm => tm.Id);
            
            entity.HasOne(tm => tm.User)
                .WithMany(u => u.TeamMemberships)
                .HasForeignKey(tm => tm.UserId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(tm => tm.Team)
                .WithMany(t => t.TeamMemberships)
                .HasForeignKey(tm => tm.TeamId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasIndex(tm => new { tm.UserId, tm.TeamId }).IsUnique();
            entity.Property(tm => tm.JoinedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });
        
        // Todo entity configuration
        modelBuilder.Entity<Todo>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Title).IsRequired().HasMaxLength(500);
            entity.Property(t => t.Description).HasMaxLength(2000);
            
            entity.HasOne(t => t.Team)
                .WithMany(team => team.Todos)
                .HasForeignKey(t => t.TeamId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(t => t.CreatedBy)
                .WithMany(u => u.CreatedTodos)
                .HasForeignKey(t => t.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasOne(t => t.AssignedTo)
                .WithMany(u => u.AssignedTodos)
                .HasForeignKey(t => t.AssignedToId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);
                
            entity.Property(t => t.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(t => t.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            entity.HasIndex(t => t.TeamId);
            entity.HasIndex(t => t.IsCompleted);
            entity.HasIndex(t => t.DueDate);
        });
        
        // TodoList entity configuration
        modelBuilder.Entity<TodoList>(entity =>
        {
            entity.HasKey(tl => tl.Id);
            entity.Property(tl => tl.Name).IsRequired().HasMaxLength(256);
            entity.Property(tl => tl.Description).HasMaxLength(1000);
            entity.Property(tl => tl.Color).HasMaxLength(7); // Hex color code
            
            entity.HasOne(tl => tl.Team)
                .WithMany(t => t.TodoLists)
                .HasForeignKey(tl => tl.TeamId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.Property(tl => tl.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(tl => tl.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(tl => tl.IsDeleted).HasDefaultValue(false);
            
            entity.HasIndex(tl => tl.TeamId);
            entity.HasIndex(tl => tl.IsDeleted);
        });
        
        // VerificationToken entity configuration
        modelBuilder.Entity<VerificationToken>(entity =>
        {
            entity.HasKey(vt => vt.Id);
            entity.Property(vt => vt.Email).IsRequired().HasMaxLength(256);
            entity.Property(vt => vt.Token).IsRequired().HasMaxLength(256);
            
            entity.HasIndex(vt => vt.Token).IsUnique();
            entity.HasIndex(vt => new { vt.Email, vt.Type });
            entity.Property(vt => vt.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });
        
        // Convert enums to strings in the database
        modelBuilder.Entity<TeamMembership>()
            .Property(tm => tm.Role)
            .HasConversion<string>();
            
        modelBuilder.Entity<Todo>()
            .Property(t => t.Priority)
            .HasConversion<string>();
            
        modelBuilder.Entity<VerificationToken>()
            .Property(vt => vt.Type)
            .HasConversion<string>();
    }
    
    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }
    
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return await base.SaveChangesAsync(cancellationToken);
    }
    
    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.Entity is User or Team or Todo or TodoList && (e.State == EntityState.Modified));
            
        foreach (var entry in entries)
        {
            switch (entry.Entity)
            {
                case User user:
                    user.UpdatedAt = DateTimeOffset.UtcNow;
                    break;
                case Team team:
                    team.UpdatedAt = DateTimeOffset.UtcNow;
                    break;
                case Todo todo:
                    todo.UpdatedAt = DateTimeOffset.UtcNow;
                    break;
                case TodoList todoList:
                    todoList.UpdatedAt = DateTimeOffset.UtcNow;
                    break;
            }
        }
    }
}