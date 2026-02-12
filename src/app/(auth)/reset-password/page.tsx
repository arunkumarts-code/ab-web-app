"use client";

import { Eye, EyeOff, Gamepad2, Key, Lock, } from "lucide-react";
import Link from "next/link";
import { UserAuth } from "@/contexts/AuthContext";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const ResetPasswordSchema = Yup.object({
   password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .required("New password is required"),
   confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Confirm password is required"),
});

const ResetPasswordPage = () => {
   const { resetPassword } = UserAuth();
   const searchParams = useSearchParams();

   const oobCode = searchParams.get("oobCode");

   const [showPassword, setShowPassword] = useState(false);
   const [showConfirm, setShowConfirm] = useState(false);
   const [status, setStatus] = useState("");
   const [success, setSuccess] = useState(false);

   const handleResetPassword = async (
      newPassword: string,
      resetForm: () => void,
      setSubmitting: (value: boolean) => void
   ) => {
      if (!oobCode) {
         setStatus("Invalid or expired reset link.");
         setSubmitting(false);
         return;
      }

      setStatus("");
      setSuccess(false);

      const result = await resetPassword(oobCode, newPassword);

      if (result.success) {
         setSuccess(true);
         setStatus("Password updated successfully. Please signin...");
         resetForm();
      } else {
         setStatus(result.error || "Reset link expired or invalid.");
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
                     Reset Password
                  </h2>
                  <p className="text-muted mb-8">
                     Create a strong password for your account. Ensure it contains at least one uppercase letter and
                     a number.
                  </p>

                  <Formik
                     initialValues={{ password: "", confirmPassword: "" }}
                     validationSchema={ResetPasswordSchema}
                     onSubmit={(values, { setSubmitting, resetForm }) =>
                        handleResetPassword(values.password, resetForm, setSubmitting)
                     }
                  >
                     {({ errors, touched, isSubmitting, handleChange }) => (
                        <Form className="space-y-4">
                           {/* New Password Input */}
                           <div>
                              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                                 New Password
                              </label>

                              <div className="relative group">
                                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />

                                 <Field
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    onChange={(e: any) => {
                                       setStatus("");
                                       handleChange(e);
                                    }}
                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-2.5 font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground"
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

                           {/* Confirm Password Input */}
                           <div>
                              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                                 Confirm Password
                              </label>

                              <div className="relative group">
                                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />

                                 <Field
                                    name="confirmPassword"
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    onChange={(e: any) => {
                                       setStatus("");
                                       handleChange(e);
                                    }}
                                    className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-2.5 font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground"
                                 />

                                 <button
                                    type="button"
                                    onClick={() => setShowConfirm((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                                 >
                                    {showConfirm ? (
                                       <EyeOff className="w-5 h-5" />
                                    ) : (
                                       <Eye className="w-5 h-5" />
                                    )}
                                 </button>
                              </div>

                              {errors.confirmPassword && touched.confirmPassword && (
                                 <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
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
                              {isSubmitting ? "Updating..." : "Update Password"}
                           </button>

                           {/* Back to Sign In */}
                           <div className="text-center mt-6">
                              <Link
                                 href="/signin"
                                 className="font-bold text-muted ml-1"
                              >
                                 Cancel
                              </Link>
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
                     <Key className="w-12 h-12 text-white ml-1 mt-1" />
                  </div>
               </div>

               <h3 className="text-3xl font-bold mb-4">Access Restored</h3>
               <p className="text-primary-400 text-lg leading-relaxed">
                  Secure your journey with updated credentials. You'll
                  be redirected to login shortly.
               </p>
            </div>
         </div>
      </div>
   );
};

export default ResetPasswordPage;
