import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from '../helpers/axios'
import { toast } from 'react-hot-toast'
import Auth from '../helpers/auth'

function Home() {
    const user = Auth.getUser()
    const titleRef = useRef()
    const [todos, setTodos] = useState([])
    const [completed, setCompleted] = useState([])
    const [edit, setEdit] = useState({})

    const todosQuery = useQuery({
        queryKey: ['todos'],
        queryFn: () => {
            return axios.get('/api/todos/mytodos')
        }
    })

    useEffect(() => {
        if (todosQuery.data?.data?.todos) {
            setTodos(todosQuery.data?.data?.todos?.filter(t => !t.completed))
            setCompleted(todosQuery.data?.data?.todos?.filter(t => t.completed))
        }

    }, [todosQuery.data])

    const addTodo = useMutation({
        mutationKey: ['addTodo'],
        mutationFn: (title) => {
            return axios.post('/api/todos/add', { title })
        }
    })

    const handleAddTodo = async () => {
        const title = titleRef.current.value
        if (!title) {
            toast("You don't have anything to do?", { icon: '🤔' })
            return
        }
        try {
            const result = await addTodo.mutateAsync(title)
            titleRef.current.value = ''
            setTodos(prev => [...prev, result.data.todo])
            todosQuery.refetch()

        } catch (e) {
            toast.error('Something went wrong')
        }
    }

    const completeTodo = useMutation({
        mutationKey: ['completeTodo'],
        mutationFn: (_id) => {
            return axios.put(`/api/todos/complete/${_id}`)
        }
    })

    const handleCompleteTodo = async (_id) => {
        try {
            const result = await completeTodo.mutateAsync(_id)
            setCompleted(prev => [...prev, result.data.todo])
            setTodos(prev => prev.filter(t => t._id !== _id))
            toast.success('Todo completed')
            todosQuery.refetch()

        } catch (e) {
            toast.error('Something went wrong')
        }
    }

    const deleteTodo = useMutation({
        mutationKey: ['completeTodo'],
        mutationFn: (_id) => {
            return axios.delete(`/api/todos/${_id}`)
        }
    })

    const handleDeleteTodo = async (_id) => {
        try {
            await deleteTodo.mutateAsync(_id)
            setCompleted(prev => prev.filter(t => t._id !== _id))
            setTodos(prev => prev.filter(t => t._id !== _id))
            toast.success('Todo deleted')
            todosQuery.refetch()

        } catch (e) {
            toast.error('Something went wrong')
        }
    }

    const editTodo = useMutation({
        mutationKey: ['editTodo'],
        mutationFn: ({ _id, title }) => {
            return axios.put(`/api/todos/edit/${_id}`, { title })
        }
    })

    const handleEditTodo = async () => {
        const title = titleRef.current.value

        if (!title) {
            toast("You don't have anything to do?", { icon: '🤔' })
            return
        }

        try {
            await editTodo.mutateAsync({ _id: edit._id, title })
            titleRef.current.value = ''
            toast.success('Todo updated')
            todosQuery.refetch()
            setEdit({})

        } catch (e) {
            toast.error('Something went wrong')
        }
    }

    return (
        <div className='container py-5 mx-auto px-2'>
            <h2 className='text-2xl mb-7 font-semibold text-blue-500'>Hello, {user.fullname}</h2>
            <div className="grid md:grid-cols-3 gap-10 md:gap-3">
                <div>
                    <h2 className='title-base mb-5'>To Do</h2>
                    {
                        todosQuery.isLoading && (
                            <p>Loading To Do List ...</p>
                        )
                    }
                    <table className='w-full'>
                        <tbody>
                            {
                                todos?.map((todo, index) => (
                                    <tr key={index}>
                                        <td className='pb-2'>
                                            <p>{todo.title}</p>
                                        </td>
                                        <td className='pb-2'>
                                            <div className="flex gap-4">
                                                <button disabled={editTodo.isLoading} onClick={() => { setEdit(todo); titleRef.current.value = todo.title }} className='text-blue-500'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                                    </svg>
                                                </button>
                                                <button disabled={completeTodo.isLoading} className='text-green-500' onClick={() => handleCompleteTodo(todo._id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                </button>
                                                <button disabled={deleteTodo.isLoading} onClick={() => handleDeleteTodo(todo._id)} className='text-red-500'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div>
                    <h2 className='title-base text-center mb-5'>
                        {
                            edit._id ? 'Update' : 'Add'
                        }
                    </h2>

                    <div className="mx-auto max-w-[20rem]">
                        <input
                            ref={titleRef}
                            className='form-control w-full mb-3'
                            type='text'
                            placeholder='Title...'
                        />

                        <div className="flex gap-2">
                            <button disabled={edit._id ? editTodo.isLoading : addTodo.isLoading} onClick={edit._id ? handleEditTodo : handleAddTodo} className={edit._id ? 'btn-update' : 'btn-primary'}>
                                {
                                    edit._id ? 'Update' : 'Add'
                                }
                            </button>

                            {
                                edit._id && (
                                    <button onClick={() => { setEdit({}); titleRef.current.value = '' }} className='btn-cancel'>Cancel</button>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className='title-base mb-5'>Completed</h2>

                    {
                        !completed.length && !todosQuery.isLoading && (
                            <p>No Completed To Do</p>
                        )
                    }

                    <table className='w-full'>
                        <tbody>
                            {
                                completed?.map((todo, index) => (
                                    <tr key={index}>
                                        <td className='pb-2'>
                                            <p>{todo.title}</p>
                                        </td>
                                        <td className='pb-2'>
                                            <div className="flex gap-4">
                                                <button disabled={editTodo.isLoading} onClick={() => { setEdit(todo); titleRef.current.value = todo.title }} className='text-blue-500'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                                    </svg>
                                                </button>
                                                <button disabled={deleteTodo.isLoading} onClick={() => handleDeleteTodo(todo._id)} className='text-red-500'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Home