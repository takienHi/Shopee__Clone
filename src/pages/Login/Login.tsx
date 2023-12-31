import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';

import Input from 'src/components/Input';
import { schema, Schema } from 'src/utils/schemas';
import authApi from 'src/apis/auth.api';
import { isAxiosUnprocessableEntityError } from 'src/utils/utils';
import { ErrorResponse } from 'src/types/utils.type';
import { AppContext } from 'src/contexts/app.context';
import Button from 'src/components/Button';
import paths from 'src/constants/paths';

type FormData = Omit<Schema, 'confirm_password'>;
const loginSchema = schema.omit(['confirm_password']);

function Login() {
    const { setIsAuthenticated, setProfile } = useContext(AppContext);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<FormData>({ resolver: yupResolver(loginSchema) });

    const loginMutation = useMutation({
        mutationFn: (body: FormData) => authApi.login(body)
    });

    const handleSubmitForm = handleSubmit((data) => {
        loginMutation.mutate(data, {
            onSuccess: (data) => {
                setIsAuthenticated(true);
                setProfile(data.data.data.user);
                navigate(paths.home);
            },
            onError: (error) => {
                if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
                    const formError = error.response?.data.data;
                    if (formError) {
                        Object.keys(formError).forEach((key) => {
                            setError(key as keyof FormData, {
                                message: formError[key as keyof FormData],
                                type: 'Server'
                            });
                        });
                    }
                }
            }
        });
    });

    return (
        <div className='bg-orange'>
            <div className='mx-auto max-w-7xl px-4'>
                <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
                    <div className='lg:col-span-2 lg:col-start-4'>
                        <form className='rounded bg-white p-10 shadow-sm' onSubmit={handleSubmitForm} noValidate>
                            <div className='text-2xl'>Đăng nhập</div>
                            <Input
                                className='mt-8'
                                type='email'
                                placeholder='Email'
                                register={register}
                                name='email'
                                errorMessage={errors.email?.message}
                            />

                            <Input
                                className='mt-3'
                                type='password'
                                placeholder='Password'
                                register={register}
                                name='password'
                                errorMessage={errors.password?.message}
                                autoComplete='on'
                            />
                            <div className='mt-3'>
                                <Button
                                    type='submit'
                                    className='flex w-full items-center justify-center bg-red-500 px-2 py-4 text-center text-sm uppercase text-white hover:bg-red-600'
                                    isLoading={loginMutation.isLoading}
                                    disabled={loginMutation.isLoading}
                                >
                                    Đăng nhập
                                </Button>
                            </div>
                            <div className='mt-8 flex items-center justify-center'>
                                <span className='text-gray-400'>Bạn chưa có tài khoản?</span>
                                <Link className='ml-1 text-red-400' to={paths.register}>
                                    Đăng ký
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
