"use client"

import { Icons } from '@/components/Icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { AuthCreditentialsValidation, TAuthCreditentialsValidator } from '@/lib/validators/accountCredentialsValidators'
import { toast } from "sonner";
import { trpc } from '@/trpc/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowBigRight } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { ZodError } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
type Props = {}

const Page = (props: Props) => {


  const searchParams = useSearchParams()  //recieving client side
  //DECLARE VALIDATOR AND THE TYPE IN AFILE SO WOU CAN USE ITON CLIENT & SERVER SIDE
  // first thing destruction this
  const { register, handleSubmit, formState: { errors } } = useForm<TAuthCreditentialsValidator>({
    resolver: zodResolver(AuthCreditentialsValidation)
  })

  const router = useRouter()
  const isSeller = searchParams.get('as') === 'seller' //as we call it like that
  const origin = searchParams.get('origin') //after signing in successfully we want to redirect back to where they were currently

  //seller
  const continueAsSeller = () => {
    router.push("?as=seller")
  }

  //buyer
  const continueAsBuyer = () => {
    router.replace('/sign-in', undefined) //all query params to undefined
  }


  // const { data } = trpc.anyapi.useQuery()
  // console.log(data)

  // we call what we define in our trpc/index router
  const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
    onSuccess: () => {
      toast.success('Sign in successfully')

      router.refresh() //this will handle the navbar and help logged in or logout states so we get fresh information

      if (origin) {
        router.push(`/${origin}`)
        return
      }

      if (isSeller) {
        router.push('/seller')
        return
      }

      router.push('/')
      router.refresh()
    },

    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error(error.message)
      }
    }
  })

  // we can pass the type in our submit function
  const onSubmit = ({ email, password }: TAuthCreditentialsValidator) => {
    // send data to the server
    signIn({
      email,
      password,
    })
  }

  return (
    <>
      <div className='container relative flex pt-20 flex-col items-center justify-center lg:px-0'>
        <div className='mx-auto fkex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <Icons.logo className='h-20 w-20' />

            <h1 className='text-2xl font-bold'> Sign in to your {isSeller ? 'seller' : ''} account</h1>

            <Link href='/sign-up' className={buttonVariants({
              variant: 'link',
              className: 'text-muted-foreground/90 hover:text-primary gap-1.5'
            })}>Don&apos;t have an account?
              <ArrowBigRight className='w-4 h-4' />
            </Link>
          </div>

          <div className='grid gap-6'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='grid gap-2'>
                <div className='grid gap-1 py-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    {...register('email')}
                    className={cn({
                      "focus-visible: ring-red-500": errors.email
                    })}
                    placeholder='you@example.com'

                  />
                  {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
                </div>
                <div className='grid gap-1 py-2'>
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    type='password' //we can change the type to password or whatever we want
                    {...register('password')} //then we pass in the register
                    className={cn({
                      "focus-visible: ring-red-500": errors.password
                    })}
                    placeholder='password'

                  />
                  {errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
                </div>
                <Button>Sign In</Button>
              </div>
            </form>

            <div className='relative'>
              <div aria-hidden='true'
                className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
              </div>
            </div>

            {isSeller ? (<Button onClick={continueAsBuyer} variant='secondary' disabled={isLoading}>Continue as customer</Button>) : (<Button onClick={continueAsSeller} variant='secondary' disabled={isLoading}>Continue as seller</Button>)}
          </div>
        </div>
      </div>

    </>
  )
}

export default Page