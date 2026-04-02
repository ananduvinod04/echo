
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import { useState } from "react"


export default function WelcomePage() {

  let[state,setState] = useState("signup")
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {state === "login" ? <LoginForm /> : <SignupForm />}
            
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block sideImage">
        <video
          src="/welcome-video.mp4"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          muted
          loop
          autoPlay
        />
      </div>
    </div>
  )
}
