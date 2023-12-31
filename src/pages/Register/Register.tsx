import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { schema, Schema } from 'src/utils/schemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { omit } from 'lodash';
import Input from 'src/components/Input';
import authApi from 'src/apis/auth.api';
import { isAxiosUnprocessableEntityError } from 'src/utils/utils';
import { ErrorResponse } from 'src/types/utils.type';
import { useContext } from 'react';
import { AppContext } from 'src/contexts/app.context';
import Button from 'src/components/Button';
import paths from 'src/constants/paths';

type FormData = Schema;

function Register() {
    const { setIsAuthenticated, setProfile } = useContext(AppContext);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<FormData>({ resolver: yupResolver(schema) });

    const registerAccountMutation = useMutation({
        // sử dụng Omit type để loại bỏ confirm_password trong type FormData
        mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
    });

    // khi bấm SubmitForm sẽ chuyền {  email, password, confirm_password }: data
    const handleSubmitForm = handleSubmit((data) => {
        // sử dụng omit để để ko truyền confirm_password
        const body = omit(data, ['confirm_password']); // {  email, password }: body
        registerAccountMutation.mutate(body, {
            onSuccess: (data) => {
                setIsAuthenticated(true);
                setProfile(data.data.data.user);
                navigate(paths.home);
            },
            onError: (error) => {
                if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
                    const formError = error.response?.data.data;
                    if (formError) {
                        Object.keys(formError).forEach((key) => {
                            setError(key as keyof Omit<FormData, 'confirm_password'>, {
                                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
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
            <div className='container'>
                <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
                    <div className='lg:col-span-2 lg:col-start-4'>
                        <form className='rounded bg-white p-10 shadow-sm' onSubmit={handleSubmitForm} noValidate>
                            <div className='text-2xl'>Đăng ký</div>

                            <Input
                                className='mt-8'
                                type='email'
                                placeholder='Email'
                                register={register}
                                name='email'
                                errorMessage={errors.email?.message}
                            />

                            <Input
                                className='mt-2'
                                type='password'
                                placeholder='Password'
                                register={register}
                                name='password'
                                errorMessage={errors.password?.message}
                                autoComplete='on'
                            />

                            <Input
                                className='mt-2'
                                type='password'
                                placeholder='Confirm Password'
                                register={register}
                                name='confirm_password'
                                errorMessage={errors.confirm_password?.message}
                                autoComplete='on'
                            />

                            <div className='mt-2'>
                                <Button
                                    type='submit'
                                    className='flex w-full items-center justify-center bg-red-500 px-2 py-4 text-center text-sm uppercase text-white hover:bg-red-600'
                                    isLoading={registerAccountMutation.isLoading}
                                    disabled={registerAccountMutation.isLoading}
                                >
                                    Đăng ký
                                </Button>
                            </div>
                            <div className='mt-8 flex items-center justify-center'>
                                <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                                <Link className='ml-1 text-red-400' to={paths.login}>
                                    Đăng nhập
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
