import { TodoPreview } from "./TodoPreview.jsx"
const { Link } = ReactRouterDOM

export function TodoList({ todos, filterBy, onRemoveTodo, onToggleTodo }) {

    const filteredTodos = todos.filter(todo => {
        if (filterBy.status === 'active') return !todo.isDone
        if (filterBy.status === 'done') return todo.isDone
        return true //show all
    })

    return (
        <ul className="todo-list">
            {filteredTodos.map(todo =>
                <li key={todo._id}
                    style={{ backgroundColor: todo.bgColor, color: todo.fontColor }}
                >
                    <TodoPreview todo={todo} onToggleTodo={() => onToggleTodo(todo)} />
                    <section>
                        <button onClick={() => onRemoveTodo(todo._id)}>Remove</button>
                        <button><Link to={`/todo/${todo._id}`}>Details</Link></button>
                        <button><Link to={`/todo/edit/${todo._id}`}>Edit</Link></button>
                    </section>
                </li>
            )}
        </ul>
    )
}