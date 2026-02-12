"use client";

import { UserAuth } from "@/contexts/AuthContext";
import { Check, Eye, EyeOff, Gamepad2, Lock, Mail, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignInSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6).required("Required"),
});

const SignInPage = () => {
  const { user, googleSignIn, emailSignIn } = UserAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (user) {
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      sessionStorage.removeItem('redirectAfterLogin');
      router.replace(redirectUrl || '/dashboard');
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    setStatus("");
    const result = await googleSignIn();
    if (!result.success) {
      setStatus(result.error || "Something went wrong");
    }
  };

  const handleEmailSignIn = async (email: string, password: string) => {
    setStatus("");
    const result = await emailSignIn(email, password);
    if (!result.success) {
      setStatus(result.error || "Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-5xl bg-surface rounded-3xl shadow-lg overflow-hidden flex">

      {/* LEFT: FORM */}
      <div className="w-full md:w-1/2 flex flex-col relative">

        {/* Logo Header */}
        <div className="px-10 pt-6 md:px-12 md:pt-8 pb-0 flex-none">
          <div className="text-2xl font-bold flex items-center gap-3">
            <Gamepad2 size={30} className="text-primary" />
            <h1 className="text-2xl font-bold text-secondary-foreground">AndiamoBac</h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-start px-10 md:px-12 pt-2 md:pt-2 pb-8 md:pb-12">
          <div className="mt-3 max-w-lg w-full">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
            <p className="text-muted mb-8">Please sign in to access your dashboard.</p>

            {/* Input Form */}
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={SignInSchema}
              onSubmit={async (values, { setSubmitting }) => {
                await handleEmailSignIn(values.email, values.password);
                setSubmitting(false);
              }}
            >
              {({ errors, touched, isSubmitting, handleChange }) => (
                <Form className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                      Email Address
                    </label>

                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />

                      <Field
                        name="email"
                        type="email"
                        onChange={(e: any) => {
                          setStatus("");
                          handleChange(e);
                        }}
                        placeholder="admin@gmail.com"
                        className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-2.5 font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground"
                      />
                    </div>

                    {errors.email && touched.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                      Password
                    </label>

                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />

                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        onChange={(e: any) => {
                          setStatus("");
                          handleChange(e);
                        }}
                        className="w-full bg-background border border-border rounded-xl pl-12 pr-12 py-2.5 font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {errors.password && touched.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Status Message */}
                  {status && (
                    <p className="text-red-500 text-sm mt-1">{status}</p>
                  )}

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-border checked:bg-primary checked:border-primary transition-all"
                        />

                        <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                      </div>

                      <span className="text-sm font-medium text-muted group-hover:text-foreground transition-colors">
                        Remember me
                      </span>
                    </label>

                    <Link href="/forgot-password" className="text-sm font-bold text-primary hover:underline">Forgot Password?</Link>

                  </div>

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary-900 text-white py-2.5 rounded-xl font-bold text-lg shadow-sm transition-all transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    Sign In
                  </button>
                </Form>
              )}
            </Formik>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase"><span
                className="bg-surface px-2 text-muted">Or sign in with</span></div>
            </div>

            {/* Social Login */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-border hover:bg-background transition-colors font-bold text-sm text-foreground"
              onClick={handleGoogleSignIn}
            >
              <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>

            <p className="text-center text-sm text-muted mt-5">
              Don't have an account?{" "}
              <Link href="/signup" className="font-bold text-primary hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: VISUAL */}
      <div className="hidden md:flex w-1/2 bg-primary/5 relative overflow-hidden flex-col items-center justify-center text-center p-12 relative map-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-primary/40 mix-blend-multiply"></div>
        <div className="relative z-10 text-white max-w-sm">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl mb-8 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-4">
              <div
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shadow-lg text-secondary-foreground">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white/70 uppercase">Daily Revenue</p>
                <p className="font-bold text-2xl text-white">$12,450</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-3/4"></div>
              </div>
              <p className="text-xs text-right text-white/80 font-medium">+15% vs yesterday</p>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-4">Track your edge with percision.</h3>
          <p className="text-primary-400 text-lg leading-relaxed">Real-time bankroll analytics, session history, and ROI tracking at your fingertips, Never guess your profit again.</p>
        </div>
      </div>

    </div>
  )
}

export default SignInPage