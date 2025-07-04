import { useEffect, useState } from "react";
import { BASE_URL } from "../../constant/app.constant";
import TodoSkeleton from "./TodoSkeleton";
import { ArrowLeftIcon, ArrowRightIcon, MoveLeftIcon, MoveRightIcon } from "lucide-react";

const TODOS_PER_PAGE = 3;

export default function TodoListData() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [newTodo, setNewTodo] = useState('');



    const fetchTodos = async () => {
        try {
            const response = await fetch(`${BASE_URL}/todos/get-all-todos`);
            const data = await response.json();
            setTodos(data);
        } catch (err) {
            console.error("Error fetching todos:", err);
            setError("Failed to fetch todos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, fromDate, toDate]);

    const handleCreateTodo = async (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;


        try {
            const response = await fetch(`${BASE_URL}/todos/create-todos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ todo: newTodo }),
            });

            if (!response.ok) {
                throw new Error("Failed to create todo");
            }

            const created = await response.json();
            setTodos((prev) => [created, ...prev]);
            setNewTodo('');
        } catch (err) {
            alert("Error creating todo.");
            console.error(err);
        }
    };


    const filteredTodos = todos.filter((todo) => {
        const todoDate = new Date(todo.createdAt).toISOString().split("T")[0];
        const isSearchMatch = todo.todo.toLowerCase().includes(search.toLowerCase());
        const isFromMatch = !fromDate || todoDate >= fromDate;
        const isToMatch = !toDate || todoDate <= toDate;
        return isSearchMatch && isFromMatch && isToMatch;
    });

    const totalPages = Math.ceil(filteredTodos.length / TODOS_PER_PAGE);
    const indexOfLastTodo = currentPage * TODOS_PER_PAGE;
    const indexOfFirstTodo = indexOfLastTodo - TODOS_PER_PAGE;
    const paginatedTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };


    return (
        <div className="container py-5" style={{ maxWidth: "700px" }}>
            <div className="card shadow-lg">
                <div className="card-body">
                    <h3 className="text-center text-primary mb-4"> Todo List</h3>

                    <form onSubmit={handleCreateTodo} className="mb-4">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Add new todo..."
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                            />
                            <button
                                className="btn btn-success"
                                type="submit"
                            >
                                Add Todo
                            </button>
                        </div>
                    </form>

                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder=" Search todos..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-6 mb-2 mb-md-0">
                            <input
                                type="date"
                                className="form-control"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <input
                                type="date"
                                className="form-control"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>
                    </div>
                    {error && (
                        <div className="alert alert-danger text-center" role="alert">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <TodoSkeleton />
                    ) : filteredTodos.length === 0 ? (
                        <p className="text-center text-muted">No todos found.</p>
                    ) : (
                        <>

                            <div className="d-flex flex-column gap-3">
                                {paginatedTodos.map((todo) => (
                                    <div key={todo._id} className="card border shadow-sm">
                                        <div className="card-body">
                                            <h5 className="card-title mb-2">{todo.todo}</h5>
                                            <div className="d-flex justify-content-between align-items-center">

                                                <small className="text-muted">
                                                    {new Date(todo.createdAt).toLocaleDateString()}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="d-flex justify-content-center flex-wrap mt-4 gap-2">
                                <button className="border-0 bg-transparent p-0" disabled={currentPage === 1} onClick={handlePreviousPage} >
                                    <ArrowLeftIcon className="cursor-pointer" />
                                </button>

                                {[...Array(totalPages)].map((_, index) => {
                                    const page = index + 1;
                                    return (
                                        <button
                                            key={page}
                                            className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-outline-primary"}`}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                <button className="border-0 bg-transparent p-0" disabled={currentPage === totalPages} onClick={handleNextPage} >
                                    <ArrowRightIcon className="cursor-pointer" />
                                </button>

                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
