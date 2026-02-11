"use client";

import { UserAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Gamepad2, Lock, Mail, ShieldCheck, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Link from "next/link";

const SignUpSchema = Yup.object({
  userName: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});
  
const SignUpPage = () => {
  const { emailSignUp } = UserAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState("");

  const handleEmailSignUp = async (email: string, password: string, userName: string) => {
    setStatus("");
    const result = await emailSignUp(email, password, userName);
    if (!result.success) {
      setStatus(result.error || "Something went wrong");
    } else {
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      sessionStorage.removeItem('redirectAfterLogin');
      router.replace(redirectUrl || '/dashboard');
    }
  };

  return (
    <div className="w-full max-w-5xl bg-surface rounded-3xl shadow-float overflow-hidden flex ">

      {/* LEFT: SIGN UP FORM */}
      <div className="w-full md:w-1/2 flex flex-col relative">

        {/* Logo Header */}
        <div className="px-10 pt-6 md:px-12 md:pt-8 pb-0 flex-none">
          <div className="flex items-center gap-3 text-primary">
            <Gamepad2 size={30} className="text-primary" />
            <h1 className="text-2xl font-bold text-secondary-foreground">AndiamoBac</h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-start px-10 md:px-12 pt-2 md:pt-2 pb-8 md:pb-12">
          <div className="mt-3 max-w-lg w-full">
            <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
            <p className="text-muted mb-8">Join AppName to manage your fleet efficiently.</p>

            <Formik
              initialValues={{ userName: "", email: "", password: "", confirmPassword: "" }}
              validationSchema={SignUpSchema}
              onSubmit={async (values, { setSubmitting }) => {
                await handleEmailSignUp(values.email, values.password, values.userName);
                setSubmitting(false);
              }}
            >
              {({ errors, touched, isSubmitting, handleChange }) => (
                <Form className="space-y-4">
                  {/* Username */}
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                      User Name
                    </label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />
                      <Field
                        name="userName"
                        type="text"
                        placeholder="User Name"
                        className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-2.5 font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-foreground"
                        onChange={(e: any) => {
                          setStatus("");
                          handleChange(e);
                        }}
                      />
                    </div>
                    {errors.userName && touched.userName && (
                      <p className="text-red-500 text-sm">{errors.userName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />
                      <Field
                        name="email"
                        type="email"
                        placeholder="admin@gmail.com"
                        className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-2.5 font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-foreground"
                        onChange={(e: any) => { setStatus(""); handleChange(e); }}
                      />
                    </div>
                    {errors.email && touched.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="w-full bg-background border border-border rounded-xl pl-12 pr-12 py-2.5 font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-foreground"
                        onChange={(e: any) => { setStatus(""); handleChange(e); }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && touched.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Confirm Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />
                      <Field
                        name="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="w-full bg-background border border-border rounded-xl pl-12 pr-12 py-2.5 font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-foreground"
                        onChange={(e: any) => { setStatus(""); handleChange(e); }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                      >
                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && touched.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>

                  {/* Status Message */}
                  {status && <p className="text-red-500 text-sm mt-1">{status}</p>}

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary-900 text-white py-2.5 rounded-xl font-bold text-lg shadow-sm transition-all transform active:scale-95 flex items-center justify-center gap-2 mt-5"
                  >
                    Create Account
                  </button>
                </Form>
              )}
            </Formik>

            <p className="text-center text-sm text-muted mt-6">
              Already have an account? <Link href="/signin" className="font-bold text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: BRAND VISUAL */}
      <div className="hidden md:flex w-1/2 bg-primary/5 relative overflow-hidden flex-col items-center justify-center text-center p-12 map-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-primary/40 mix-blend-multiply"></div>
        <div className="relative z-10 text-white max-w-sm">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl mb-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shadow-lg text-secondary-foreground">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white/70 uppercase">Fleet Security</p>
                <p className="font-bold text-lg text-white">Enterprise Grade</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium text-white">Encrypted</span>
              <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium text-white">2FA Ready</span>
            </div>
          </div>
          <h3 className="text-4xl font-bold mb-4">Start your journey.</h3>
          <p className="text-primary-400 text-lg leading-relaxed">
            Join thousands of fleet managers optimizing their operations with AppName today.
          </p>
        </div>
      </div>

    </div>
  );
};

export default SignUpPage;
