import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { AudioLines } from "lucide-react"
import { useState } from "react"

export function SignupForm({
  className,
  ...props
}) {
  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    email: '',
    password: '',
    dob: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, userId, email, password, dob } = formData;

    if (!name || !userId || !email || !password || !dob) {
      setError('All fields are required');
      return;
    }

    setError('');
    // Proceed with form submission
    console.log('Form submitted:', formData);
  };

  return (
    <form className={cn("flex flex-col gap-4 max-w-md mx-auto", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex items-center justify-center gap-2">
          <AudioLines className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold">Echo</h1>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-xl font-semibold">Create your account</h2>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-background" />
        </Field>
        <Field>
          <FieldLabel htmlFor="userId">User ID</FieldLabel>
          <Input
            id="userId"
            type="text"
            placeholder="johndoe123"
            value={formData.userId}
            onChange={handleChange}
            required
            className="bg-background" />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-background" />
         
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input 
            id="password" 
            type="password" 
            value={formData.password}
            onChange={handleChange}
            required 
            className="bg-background" />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="dob">Date of Birth</FieldLabel>
          <Input
            id="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            required
            className="bg-background" />
        </Field>
        
        <Field>
          <Button type="submit">Create Account</Button>
        </Field>
       
        <Field>
        
          <FieldDescription className="px-6 text-center">
            Already have an account? <a href="#" onClick={()=>(props.setState("login"))}>Sign in</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
