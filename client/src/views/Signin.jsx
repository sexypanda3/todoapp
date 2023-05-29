import React, { useEffect } from 'react'
import * as Yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useMutation } from '@tanstack/react-query'
import axios from '../helpers/axios'
import Auth from '../helpers/auth'
import { Link } from 'react-router-dom'

function Signin() {
  const initialValues = {
    email: '',
    password: ''
  }

  const validationSchema = Yup.object({
    email: Yup.string().email('Email is not valid').required('Email is required'),
    password: Yup.string().required('Password is requried').min(8, 'Password must have at least 8 characters')
  })

  const { mutate, data, error, isLoading } = useMutation({
    mutationFn: (values) => {
      return axios.post('/api/auth/signin', values)
    }
  })

  useEffect(() => {
    if (data) {
      Auth.login(data.data.token)
    }

  }, [data])


  return (
    <div className='container mx-auto py-5'>
      <div className='mt-5'>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={mutate}
        >
          {
            ({ errors, touched }) => (
              <Form>

                <div className="max-w-[30rem] w-full mx-auto">
                  <h1 className='title mb-5'>Signin</h1>

                  {
                    error && (
                      <>
                        {error?.response?.data?.message && <div className='alert-red mb-3'>{error?.response?.data?.message}</div>}
                        {
                          Array.isArray(error?.response?.data?.errors) && (
                            <div>
                              <ul>
                                {
                                  error?.response?.data?.errors.map((e, i) => (
                                    <li key={i}>{e.msg}</li>
                                  ))
                                }
                              </ul>
                            </div>
                          )
                        }
                      </>
                    )
                  }

                  <div className='flex flex-col mb-3'>
                    <label htmlFor='email' className='form-label'>Email</label>
                    <Field type='email' name='email' id='email' className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`} />
                    <ErrorMessage name='email' component='div' className='invalid-feedback' />
                  </div>

                  <div className='flex flex-col mb-3'>
                    <label htmlFor='password' className='form-label'>Password</label>
                    <Field type='password' name='password' id='password' className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`} />
                    <ErrorMessage name='password' component='div' className='invalid-feedback' />
                  </div>

                  <div className='mb-3'>
                    <button className='btn-primary' disabled={isLoading} type='submit'>Signin</button>
                  </div>

                  <div className='pt-3'>
                    <p className='text-center'>Don't have an account ? <Link className='underline' to='/signup'>Signup</Link></p>
                  </div>
                </div>
              </Form>
            )
          }
        </Formik>
      </div>

    </div>
  )
}

export default Signin