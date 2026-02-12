"use client";

import { Gamepad2, Mail, Send } from "lucide-react";
import Link from "next/link";
import { UserAuth } from "@/contexts/AuthContext";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useState } from "react";

const ForgotPasswordSchema = Yup.object({
   email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
});

const ForgotPasswordPage = () => {
   const { forgotPassword } = UserAuth();

   const [status, setStatus] = useState("");
   const [success, setSuccess] = useState(false);

   const handleForgotPassword = async (
      email: string,
      setSubmitting: (isSubmitting: boolean) => void
   ) => {
      setStatus("");
      setSuccess(false);

      const result = await forgotPassword(email);

      if (result.success) {
         setSuccess(true);
         setStatus("Reset link sent! Please check your inbox.");
      } else {
         setStatus(result.error || "Something went wrong.");
      }

      setSubmitting(false);
   };

   return (
      <div className="w-full max-w-5xl bg-surface rounded-3xl shadow-lg overflow-hidden flex min-h-[600px]">

         {/* LEFT: FORM */}
         <div className="w-full md:w-1/2 flex flex-col relative">
            {/* Logo Header */}
            <div className="px-10 pt-6 md:px-12 md:pt-8 pb-0 flex-none">
               <div className="text-2xl font-bold flex items-center gap-3">
                  <Gamepad2 size={30} className="text-primary" />
                  <h1 className="text-2xl font-bold text-secondary-foreground">AndiamoBac</h1>
               </div>
            </div>

            <div className="flex-1 flex flex-col justify-start px-10 md:px-12 pt-2 pb-12">
               <div className="mt-3 max-w-lg w-full">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                     Forgot Password?
                  </h2>
                  <p className="text-muted mb-8">
                     Enter your email address below and we'll send you a link to reset your password.
                  </p>

                  <Formik
                     initialValues={{ email: "" }}
                     validationSchema={ForgotPasswordSchema}
                     onSubmit={(values, { setSubmitting }) =>
                        handleForgotPassword(values.email, setSubmitting)
                     }
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
                                    placeholder="admin@gmail.com"
                                    onChange={(e: any) => {
                                       setStatus("");
                                       handleChange(e);
                                    }}
                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-2.5 font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground"
                                 />
                              </div>

                              {errors.email && touched.email && (
                                 <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                              )}
                           </div>

                           {/* Status Message */}
                           {status && (
                              <p
                                 className={`text-sm mt-1 ${success ? "text-green-500" : "text-red-500"
                                    }`}
                              >
                                 {status}
                              </p>
                           )}

                           {/* Action Button */}
                           <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full bg-primary hover:bg-primary-900 text-white py-2.5 rounded-xl font-bold text-lg shadow-sm transition-all transform active:scale-95 flex items-center justify-center gap-2"
                           >
                              {isSubmitting ? "Sending..." : "Send Reset Link"}
                           </button>

                           {/* Back to Sign In */}
                           <div className="text-center mt-6">
                              <p className="text-sm text-muted">
                                 Remember your password?
                                 <Link
                                    href="/signin"
                                    className="font-bold text-primary hover:underline ml-1"
                                 >
                                    Sign in
                                 </Link>
                              </p>
                           </div>
                        </Form>
                     )}
                  </Formik>
               </div>
            </div>
         </div>

         {/* RIGHT: VISUAL */}
         <div className="hidden md:flex w-1/2 bg-primary/5 relative overflow-hidden flex-col items-center justify-center text-center p-12 map-bg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-primary/40 mix-blend-multiply"></div>

            <div className="relative z-10 text-white max-w-sm">
               <div className="flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl mb-8 transform -rotate-2">
                     <Send className="w-12 h-12 text-white ml-1 mt-1" />
                  </div>
               </div>

               <h3 className="text-3xl font-bold mb-4">Check your inbox</h3>
               <p className="text-primary-400 text-lg leading-relaxed">
                  We'll send a secure link to reset your password. It usually arrives within minutes.
               </p>
            </div>
         </div>
      </div>
   );
};

export default ForgotPasswordPage;
