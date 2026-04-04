import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth.types';
import { validateEmail, validatePassword } from '../../utils/validation';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  Stethoscope,
  Eye,
  EyeOff,
  User,
  Heart,
  Briefcase,
  FileText,
  Building,
  MapPin,
  Phone,
  History,
  Upload,
  CheckCircle2
} from 'lucide-react';

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: UserRole.DENTIST,
    license_number: '',
    specialization: '',
    clinic_name: '',
    clinic_address: '',
    phone_number: '',
    years_of_experience: '',
  });
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: '',
      submit: ''
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFile(e.target.files[0]);
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message || '';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.role === UserRole.DENTIST) {
      if (!formData.license_number.trim()) {
        newErrors.license_number = 'License number is required';
      }
      if (!licenseFile) {
        newErrors.licenseFile = 'Upload license document for verification';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        role: formData.role,
        profile: formData.role === UserRole.DENTIST ? {
          license_number: formData.license_number,
          specialization: formData.specialization,
          clinic_name: formData.clinic_name,
          clinic_address: formData.clinic_address,
          phone_number: formData.phone_number,
          years_of_experience: formData.years_of_experience,
          verification_status: 'PENDING'
        } : undefined
      }, licenseFile || undefined, profileImage || undefined);
      navigate('/dashboard');
    } catch (err: unknown) {
      let errorMessage = 'Registration failed. Please try again.';
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { detail?: string } } }).response;
        errorMessage = response?.data?.detail || errorMessage;
      }
      setErrors({
        submit: errorMessage,
      });
    }
  };

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2 overflow-hidden text-slate-900 bg-slate-50">

      {/* LEFT SIDE - REGISTER FORM */}
      <div className="relative flex items-center justify-center p-4 lg:p-8 isolate overflow-y-auto w-full max-h-screen">
        <div
          className="absolute inset-0 -z-20 h-full w-full opacity-40 fixed"
          style={{
            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden -z-10 pointer-events-none fixed">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-[10%] left-[10%] h-[400px] w-[400px] rounded-full bg-blue-200/40 blur-[90px]"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-blue-200/40 blur-[90px]"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[520px] my-auto"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-8 lg:p-12 space-y-8 my-8">
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
              <p className="text-slate-500">Join DentalAI to manage your dental practice</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.submit && (
                <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 shrink-0" />
                  <span>{errors.submit}</span>
                </div>
              )}

              {/* Profile Image Section */}
              {formData.role === UserRole.DENTIST && (
                <div className="flex flex-col items-center justify-center space-y-3 mb-2">
                  <div className="relative group">
                    <div className={cn(
                      "w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all bg-slate-50/50 hover:bg-white",
                      profilePreview ? "border-primary border-solid" : "border-slate-200 group-hover:border-primary/50"
                    )}>
                      {profilePreview ? (
                        <img src={profilePreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center text-slate-400 group-hover:text-primary transition-colors">
                          <Upload className="h-6 w-6 mb-1" />
                          <span className="text-[10px] font-black uppercase">Photo</span>
                        </div>
                      )}
                      <input
                        type="file"
                        onChange={handleProfileImageChange}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                    </div>
                    {profilePreview && (
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-lg border-2 border-white pointer-events-none">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Identity</p>
                    <p className="text-[9px] text-slate-300 mt-0.5">Professional Clinician Photo</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    name="full_name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className={cn(
                      "flex h-14 w-full rounded-xl border bg-slate-50/50 px-4 py-3 pl-12 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                      errors.full_name ? "border-red-300" : "border-slate-200"
                    )}
                  />
                </div>
                {errors.full_name && <p className="text-xs text-red-600 font-medium ml-1">{errors.full_name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={cn(
                      "flex h-14 w-full rounded-xl border bg-slate-50/50 px-4 py-3 pl-12 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                      errors.email ? "border-red-300" : "border-slate-200"
                    )}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-600 font-medium ml-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1">Role</label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="appearance-none flex h-14 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-12 pr-10 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pointer-events-none"
                    disabled
                  >
                    <option value={UserRole.DENTIST}>Dentist</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Dentist fields */}
              {formData.role === UserRole.DENTIST && (
                <div className="space-y-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-600">Professional Credentials</h3>
                    <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-amber-100">Verification Required</span>
                  </div>
                  <p className="text-[11px] text-slate-400 -mt-5 italic">Your account will be reviewed by our administration team after registration.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 ml-1">License Number *</label>
                      <div className="relative group">
                        <FileText className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                          name="license_number"
                          type="text"
                          placeholder="LIC-123456"
                          value={formData.license_number}
                          onChange={handleChange}
                          required
                          className={cn(
                            "flex h-14 w-full rounded-xl border bg-slate-50/50 px-4 py-3 pl-12 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                            errors.license_number ? "border-red-300" : "border-slate-200"
                          )}
                        />
                      </div>
                      {errors.license_number && <p className="text-xs text-red-600 font-medium ml-1">{errors.license_number}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 ml-1">Specialization</label>
                      <div className="relative group">
                        <Stethoscope className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                          name="specialization"
                          type="text"
                          placeholder="e.g. Orthodontics"
                          value={formData.specialization}
                          onChange={handleChange}
                          className="flex h-14 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-12 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 ml-1">Years of Experience</label>
                      <div className="relative group">
                        <History className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                          name="years_of_experience"
                          type="text"
                          placeholder="e.g. 5+ years"
                          value={formData.years_of_experience}
                          onChange={handleChange}
                          className="flex h-14 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-12 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 ml-1">Phone Number</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                          name="phone_number"
                          type="tel"
                          placeholder="+1 234 567 890"
                          value={formData.phone_number}
                          onChange={handleChange}
                          className="flex h-14 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-12 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 ml-1">License Proof (PDF/Image) *</label>
                    <div 
                      className={cn(
                        "relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 transition-all bg-slate-50/30",
                        errors.licenseFile ? "border-red-300 bg-red-50/30" : "border-slate-200 hover:border-primary hover:bg-primary/5",
                        licenseFile ? "border-emerald-200 bg-emerald-50/30" : ""
                      )}
                    >
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      {licenseFile ? (
                        <>
                          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                            <ShieldCheck className="h-6 w-6 text-emerald-600" />
                          </div>
                          <p className="text-xs font-bold text-emerald-700 truncate max-w-full px-4 text-center">
                            {licenseFile.name}
                          </p>
                          <p className="text-[10px] text-emerald-500 mt-1">File selected - Click to change</p>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                            <Upload className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
                          </div>
                          <p className="text-xs font-bold text-slate-600">Click or drag to upload</p>
                          <p className="text-[10px] text-slate-400 mt-1">PDF, JPG or PNG (max 5MB)</p>
                        </>
                      )}
                    </div>
                    {errors.licenseFile && <p className="text-xs text-red-600 font-medium ml-1">{errors.licenseFile}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 ml-1">Clinic Name</label>
                      <div className="relative group">
                        <Building className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                          name="clinic_name"
                          type="text"
                          placeholder="Smile Dental"
                          value={formData.clinic_name}
                          onChange={handleChange}
                          className="flex h-14 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-12 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 ml-1">Clinic Address</label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                          name="clinic_address"
                          type="text"
                          placeholder="123 Dental St"
                          value={formData.clinic_address}
                          onChange={handleChange}
                          className="flex h-14 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-12 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={cn(
                      "flex h-14 w-full rounded-xl border bg-slate-50/50 px-4 py-3 pl-12 pr-12 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                      errors.password ? "border-red-300" : "border-slate-200"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-600 font-medium ml-1">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={cn(
                      "flex h-14 w-full rounded-xl border bg-slate-50/50 px-4 py-3 pl-12 pr-12 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                      errors.confirmPassword ? "border-red-300" : "border-slate-200"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-600 font-medium ml-1">{errors.confirmPassword}</p>}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full rounded-xl bg-gradient-to-r from-primary to-blue-700 px-4 py-4 text-sm font-bold text-white shadow-xl hover:shadow-primary/40 transition-all duration-200",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Start Your Journey</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </div>
              </motion.button>
            </form>

            <div className="text-center pt-4">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:flex relative h-full w-full flex-col p-16 text-white overflow-hidden bg-slate-900 sticky top-0 h-screen">
        <img
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop"
          alt="Modern Dentistry"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-indigo-950/80 to-slate-950/90 mix-blend-multiply" />

        <div className="relative z-20 flex items-center gap-3">
          <Stethoscope className="h-8 w-8 text-blue-300" />
          <span className="text-2xl font-bold">DentalAI<span className="text-blue-400">Diagnostics</span></span>
        </div>

        <div className="relative z-20 mt-auto max-w-lg">
          <div className="rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-8">
            <Heart className="h-8 w-8 text-blue-300 mb-4" />
            <p className="text-xl font-light leading-relaxed mb-6">
              "Your dental health is our priority. Get instant AI insights and connect with top-tier professionals."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;