namespace TodoApp.Api.Features.TodoLists.DTOs;

public record GetTodoListsResponse(
    List<TodoListDto> TodoLists
);

public record TodoListDto(
    Guid Id,
    string Name,
    string? Description,
    string? Color,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    int TodoCount = 0 // Will be populated later when we have todos
);