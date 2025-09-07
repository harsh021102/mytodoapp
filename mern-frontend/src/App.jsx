import axios from "axios";
import { useEffect, useState } from "react";
import { FaTrash, FaRegCheckSquare } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
const API_URL = import.meta.env.VITE_API_URL;

// Validation schema using Yup
const validationSchema = Yup.object({
	task: Yup.string().required("Task cannot be blank"),
});
const filterValues = ["All", "Active", "Completed"];
function App() {
	const [tasks, setTasks] = useState([]);
	const [refresh, setRefresh] = useState(false);
	const [filter, setFilter] = useState("All");
	// const [filteredTasks, setFilteredTasks] = useState([]);
	const fetchTasks = async () => {
		try {
			const response = await axios.get(`${API_URL}/tasks`);
			setTasks(response.data.tasks);
			console.log(response.data.tasks);
		} catch (error) {
			console.error("Error fetching tasks:", error);
		}
	};
	const createTask = async (task) => {
		try {
			const payload = { name: task, completed: false };
			const response = await axios.post(`${API_URL}/tasks`, payload);
			console.log(response.data.task);
			setTasks([...tasks, response.data.task]);
			setRefresh(!refresh);
		} catch (error) {
			console.error("Error creating task:", error);
		}
	};
	const deleteTask = async (taskId) => {
		try {
			const response = await axios.delete(`${API_URL}/tasks/${taskId}`);
			console.log(response.data.message);
			setRefresh(!refresh);
		} catch (error) {
			console.error("Error deleting task:", error);
		}
	};
	const updateTask = async (taskId, updatedTask) => {
		try {
			const response = await axios.patch(
				`${API_URL}/tasks/${taskId}`,
				updatedTask
			);
			console.log(response.data.task);
			setRefresh(!refresh);
		} catch (error) {
			console.error("Error updating task:", error);
		}
	};
	const toggleTask = (id) => {
		setTasks(
			tasks.map((task) =>
				task._id === id ? { ...task, completed: !task.completed } : task
			)
		);
	};

	const filteredTasks = tasks.filter((task) => {
		if (filter === "Active") return !task.completed;
		else if (filter === "Completed") return task.completed;
		return true;
	});

	useEffect(() => {
		console.log(API_URL);
		fetchTasks();
		console.log(filteredTasks);
	}, [refresh]);
	return (
		<>
			<div className="main-container flex justify-center items-star h-screen">
				<div className="app-container flex flex-col sm:w-full md:w-10/12 lg:w-5/12 rounded-lg gap-5 ">
					<div className="heading-container w-full flex flex-col justify-center items-center gap-1 py-5">
						<div className="flex justify-center items-center gap-1 p-3 text-3xl font-bold">
							<FaRegCheckSquare />
							<h1 className="heading flex justify-center items-center p-1 text-xl font-normal ">
								Todo App
							</h1>
						</div>
						<h2 className="sub-heading flex justify-center items-center p-1 text-xl font-normal text-center">
							Todo app to manage your tasks efficiently.
						</h2>
					</div>
					<div className="data-container border rounded-md border-gray-200 w-full flex justify-center items-center flex-col gap-3 py-5">
						<div className="form-container flex justify-center items-center gap-1 w-5/6 h-16 ">
							<Formik
								initialValues={{ task: "" }}
								validationSchema={validationSchema}
								onSubmit={(values, { resetForm }) => {
									createTask(values.task);
									resetForm(); // clear input after submission
								}}
							>
								{({ isSubmitting }) => (
									<Form className="flex justify-center items-start gap-1 w-full h-full  ">
										<div className="input flex w-full h-full flex-col">
											<Field
												type="text"
												name="task"
												className="h-3/4 rounded-md bg-gray-200 pl-2 text-sm focus:outline-none"
												placeholder="Add your task"
											/>
											<ErrorMessage
												name="task"
												component="div"
												className="text-red-500 text-sm ml-2 h-1/4"
											/>
										</div>
										<button
											type="submit"
											disabled={isSubmitting}
											className="w-3/12 h-3/4 bg-black text-white rounded-md flex justify-center items-center gap-1 px-2"
										>
											<IoAddOutline className="w-6 h-6" />
											Add
										</button>
									</Form>
								)}
							</Formik>
						</div>
						<div className="count-container flex justify-start items-center gap-1 w-5/6 h-12 space-x-2 overflow-x-auto">
							{filterValues.map((value, index) => (
								<button
									key={index}
									className={`h-3/4  rounded-md justify-center items-center gap-2 px-3 ${
										filter === value
											? "bg-black text-white"
											: "bg-white text-black border border-gray-300"
									} ${
										value === "All"
											? tasks.length > 0
												? "flex"
												: "hidden"
											: value === "Active"
											? tasks.filter((task) => !task.completed).length > 0
												? "flex"
												: "hidden"
											: tasks.filter((task) => task.completed).length > 0
											? "flex"
											: "hidden"
									}`}
									onClick={() => setFilter(value)}
								>
									{value}
									<div
										className={`w-5 h-5 flex justify-center items-center ${
											filter === value
												? "bg-black text-white"
												: "bg-white text-black"
										}`}
									>
										{value === "All"
											? tasks.length
											: value === "Active"
											? tasks.filter((task) => !task.completed).length
											: tasks.filter((task) => task.completed).length}
									</div>
								</button>
							))}
						</div>
						<div className="data-list w-5/6 flex flex-col items-center gap-2 h-44 overflow-y-auto">
							{filteredTasks.length > 0 ? (
								filteredTasks.map((task) => (
									<div
										key={task._id}
										className="item flex justify-start items-center gap-3 w-full h-14 border rounded-md border-gray-300 hover:bg-slate-100 py-4 pl-2"
									>
										<input
											type="checkbox"
											className="w-4 h-4 text-blue-500 accent-black bg-gray-700 rounded border-gray-800 focus:outline-none cursor-pointer"
											checked={task.completed}
											onChange={() => {
												toggleTask(task._id);
												updateTask(task._id, { completed: !task.completed });
											}}
										/>
										<h1
											className={`w-10/12 h-full text-sm ${
												task.completed ? "line-through text-gray-800" : ""
											}`}
										>
											{task.name}
										</h1>
										<button
											className="w-12 h-full text-white border-solid rounded-md flex justify-center items-center"
											onClick={() => deleteTask(task._id)}
										>
											<FaTrash className="text-red-700" />
										</button>
									</div>
								))
							) : (
								<h1>No Tasks</h1>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
