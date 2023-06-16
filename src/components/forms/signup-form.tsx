"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useSignUp } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import type { z } from "zod"

import type {
  authSchema,
  emailVerificationSchema,
} from "@/lib/validations/auth"
import { storeSchema } from "@/lib/validations/store"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

type AuthInputs = z.infer<typeof authSchema>
type EmailVerificationInputs = z.infer<typeof emailVerificationSchema>

export function SignUpForm() {
  const router = useRouter()
  const { isLoaded, signUp, setActive } = useSignUp()
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  // Auth form
  const authForm = useForm<AuthInputs>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // State for the form
  function onSubmit(data: AuthInputs) {
    if (!isLoaded) return
    try {
      startTransition(async () => {
        await signUp.create({
          emailAddress: data.email,
          password: data.password,
        })

        // Send the email
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

        // Change the UI to our pending section
        setPendingVerification(true)
      })
    } catch (error) {
      error instanceof Error && toast.error(error.message)
    }
  }

  // Email verification form
  const verificationForm = useForm({
    defaultValues: {
      code: "",
    },
  })

  // This verifies the user using email code that is delivered.
  function onSubmitVerify(data: EmailVerificationInputs) {
    if (!isLoaded) return
    try {
      startTransition(async () => {
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: data.code,
        })
        if (completeSignUp.status !== "complete") {
          /*  investigate the response, to see if there was an error
            or if the user needs to complete more steps.*/
          console.log(JSON.stringify(completeSignUp, null, 2))
        }
        if (completeSignUp.status === "complete") {
          await setActive({ session: completeSignUp.createdSessionId })
          router.push("/")
        }
      })
    } catch (error) {
      error instanceof Error && toast.error(error.message)
    }
  }

  // // This verifies the user using email code that is delivered.
  // const onPressVerify = async (e) => {
  //   e.preventDefault()
  //   if (!isLoaded) {
  //     return
  //   }

  //   try {
  //     const completeSignUp = await signUp.attemptEmailAddressVerification({
  //       code,
  //     })
  //     if (completeSignUp.status !== "complete") {
  //       /*  investigate the response, to see if there was an error
  //        or if the user needs to complete more steps.*/
  //       console.log(JSON.stringify(completeSignUp, null, 2))
  //     }
  //     if (completeSignUp.status === "complete") {
  //       await setActive({ session: completeSignUp.createdSessionId })
  //       router.push("/")
  //     }
  //   } catch (err: any) {
  //     console.error(JSON.stringify(err, null, 2))
  //   }
  // }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Sign up</CardTitle>
        <CardDescription>Sign up for a new account</CardDescription>
      </CardHeader>
      <CardContent>
        {pendingVerification ? (
          <Form {...authForm}>
            <form
              className="grid w-full max-w-xl gap-5"
              onSubmit={(...args) =>
                void authForm.handleSubmit(onSubmit)(...args)
              }
            >
              <FormField
                control={authForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg. rodneymullen180@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={authForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Textarea placeholder="**********" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="w-fit" disabled={isPending}>
                {isPending && (
                  <Icons.spinner
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Sign Up
                <span className="sr-only">Sign Up</span>
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...verificationForm}>
            <form
              className="grid w-full max-w-xl gap-5"
              onSubmit={(...args) =>
                void verificationForm.handleSubmit(onSubmitVerify)(...args)
              }
            >
              <FormField
                control={verificationForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="eg. 123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-fit" disabled={isPending}>
                {isPending && (
                  <Icons.spinner
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Verify Email
                <span className="sr-only">Verify Email</span>
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
