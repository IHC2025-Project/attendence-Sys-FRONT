'use client';
import React, { useState, useEffect } from 'react';
import { User, GraduationCap, Award, ChevronRight, Check, Eye, EyeOff, X, RefreshCw, AlertCircle, CheckCircle2, UserCheck, Mail, Phone, MapPin, Calendar, CreditCard, BookOpen } from 'lucide-react';

interface UserRegistrationProps {
  onClose: () => void;
}

const UserRegistration = ({ onClose }: UserRegistrationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFaculties, setLoadingFaculties] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [faculties, setFaculties] = useState<Array<{
    id: string;
    name: string;
    icon: string;
    careers: string[];
  }>>([]);
  const [formData, setFormData] = useState({
    name: '', last_name: '', email: '', dni: '', address: '', birthdate: '',
    code: '', cell_phone_number: '', user: '', password: '', role: 'student',
    faculty_id: '', career: '', label_id: '',
  });

  // Mapeo de iconos por tipo de facultad
  const getFacultyIcon = (facultyName: string): string => {
    const name = facultyName.toLowerCase();
    if (name.includes('ingenier')) return '⚙️';
    if (name.includes('administra')) return '💼';
    if (name.includes('educaci') || name.includes('social')) return '📚';
    if (name.includes('medicina') || name.includes('veterinar')) return '🐾';
    if (name.includes('derecho')) return '⚖️';
    if (name.includes('psicolog')) return '🧠';
    if (name.includes('arte') || name.includes('diseño')) return '🎨';
    return '🎓'; // Icono por defecto
  };

  // Fetch facultades desde la API
  const fetchFaculties = async () => {
    try {
      setLoadingFaculties(true);
      const response = await fetch('http://localhost:4000/faculty/getall', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        // Asumiendo que la respuesta es un array de facultades
        // Puedes ajustar esta estructura según tu API
        const facultiesData = data.map((faculty: any) => ({
          id: faculty.id || faculty._id,
          name: faculty.name_faculty || faculty.name,
          icon: getFacultyIcon(faculty.name_faculty || faculty.name),
          careers: faculty.careers || [faculty.career] || []
        }));
        setFaculties(facultiesData);
      } else {
        console.error('Error al obtener facultades');
        // Fallback a datos estáticos si la API falla
        setFaculties([
          { 
            id: 'FAC001', 
            name: 'Ingeniería', 
            icon: '⚙️',
            careers: ['Ingeniería Informáticas y Sistemas', 'Ingeniería Civil', 'Ingeniería Industrial','Ingeniería Agroecológica y Desarrollo Rural','Ingeniería de Minas'] 
          },
          { 
            id: 'FAC002', 
            name: 'Facultad de Administración', 
            icon: '💼',
            careers: ['Administración'] 
          },
          { 
            id: 'FAC003', 
            name: 'Facultad de Educación y Ciencia Sociales', 
            icon: '📚',
            careers: ['Ciencia Política y Gobernabilidad', 'Educación Física y Danzas','Educación Inicial Intercultural Bilingüe: Primera y Segunda Infancia','Matemática e Informática'] 
          },
          { 
            id: 'FAC004', 
            name: 'Facultad de Medicina Veterinaria Zootecnia', 
            icon: '🐾',
            careers: ['Medicina Veterinaria y Zootecnia'] 
          }
        ]);
      }
    } catch (error) {
      console.error('Error conectando con la API de facultades:', error);
      // Fallback a datos estáticos
      setFaculties([
        { 
          id: 'FAC001', 
          name: 'Ingeniería', 
          icon: '⚙️',
          careers: ['Ingeniería Informáticas y Sistemas', 'Ingeniería Civil', 'Ingeniería Industrial','Ingeniería Agroecológica y Desarrollo Rural','Ingeniería de Minas'] 
        },
        { 
          id: 'FAC002', 
          name: 'Facultad de Administración', 
          icon: '💼',
          careers: ['Administración'] 
        },
        { 
          id: 'FAC003', 
          name: 'Facultad de Educación y Ciencia Sociales', 
          icon: '📚',
          careers: ['Ciencia Política y Gobernabilidad', 'Educación Física y Danzas','Educación Inicial Intercultural Bilingüe: Primera y Segunda Infancia','Matemática e Informática'] 
        },
        { 
          id: 'FAC004', 
          name: 'Facultad de Medicina Veterinaria Zootecnia', 
          icon: '🐾',
          careers: ['Medicina Veterinaria y Zootecnia'] 
        }
      ]);
    } finally {
      setLoadingFaculties(false);
    }
  };

  // Cargar facultades al montar el componente
  useEffect(() => {
    fetchFaculties();
  }, []);

  const steps = [
    { id: 0, name: 'Datos Personales', icon: User, description: 'Información básica del usuario' },
    { id: 1, name: 'Facultad y Carrera', icon: GraduationCap, description: 'Selección académica' },
    { id: 2, name: 'Credenciales', icon: Award, description: 'Configuración de acceso' }
  ];

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Email inválido' : '';
      case 'dni':
        return value.length < 8 ? 'DNI debe tener al menos 8 caracteres' : '';
      case 'password':
        return value.length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : '';
      case 'cell_phone_number':
        return value && !/^\d{9}$/.test(value) ? 'Número debe tener 9 dígitos' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Validación en tiempo real
    const error = validateField(field, value.toString());
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const generateCredentials = () => {
    if (formData.name && formData.last_name) {
      const username = `${formData.name.toLowerCase().slice(0, 3)}${formData.last_name.toLowerCase().slice(0, 3)}${Math.floor(Math.random() * 1000)}`;
      const password = Math.random().toString(36).slice(-8);
      setFormData(prev => ({
        ...prev,
        user: username,
        password: password,
        label_id: `LBL${Math.floor(100000 + Math.random() * 900000)}`
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      if (currentStep === 1) generateCredentials();
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        const requiredFields = ['name', 'last_name', 'email', 'dni'];
        return requiredFields.every(field => formData[field as keyof typeof formData]) &&
               !Object.keys(errors).some(key => requiredFields.includes(key) && errors[key]);
      case 1:
        return formData.faculty_id && formData.career;
      case 2:
        return formData.user && formData.password && formData.label_id;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const selectedFaculty = faculties.find(f => f.id === formData.faculty_id);
      
      // 1. Primero registrar/verificar la facultad
      const facultyPayload = {
        name_faculty: selectedFaculty?.name || '',
        career: formData.career
      };

      console.log('Registrando facultad:', facultyPayload);
      
      const facultyResponse = await fetch('http://localhost:4000/faculty/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facultyPayload)
      });

      let facultyResult = null;
      if (facultyResponse.ok) {
        facultyResult = await facultyResponse.json();
        console.log('Facultad registrada:', facultyResult);
      } else {
        const facultyError = await facultyResponse.json();
        console.log('Error en facultad (puede ser normal si ya existe):', facultyError);
        // Continuar con el registro del usuario aunque la facultad falle
      }

      // 2. Registrar el usuario
      const userPayload = {
        person: {
          name: formData.name.trim(),
          last_name: formData.last_name.trim(),
          email: formData.email.trim().toLowerCase(),
          dni: formData.dni.trim(),
          address: formData.address.trim() || null,
          birthdate: formData.birthdate || null,
          code: formData.code.trim() || null,
          cell_phone_numer: formData.cell_phone_number.trim() || null, // Nota: mantengo el typo "numer" si está en tu API
          label_id: formData.label_id.trim(),
          faculty_id: formData.faculty_id
        },
        user: {
          user: formData.user.trim(),
          password: formData.password,
          role: formData.role
        }
      };

      console.log('Registrando usuario:', userPayload);

      const userResponse = await fetch('http://localhost:4000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
      });

      if (userResponse.ok) {
        const userResult = await userResponse.json();
        console.log('Usuario registrado exitosamente:', userResult);
        
        // Mostrar mensaje de éxito más detallado
        alert(`¡Usuario registrado exitosamente!\n\nUsuario: ${formData.user}\nEmail: ${formData.email}\nFacultad: ${selectedFaculty?.name}\nCarrera: ${formData.career}`);
        onClose();
      } else {
        const userError = await userResponse.json();
        console.error('Error al registrar usuario:', userError);
        
        // Manejo de errores específicos
        let errorMessage = 'No se pudo registrar el usuario.';
        if (userError.message) {
          errorMessage = userError.message;
        } else if (userResponse.status === 400) {
          errorMessage = 'Datos inválidos. Verifique la información ingresada.';
        } else if (userResponse.status === 409) {
          errorMessage = 'El usuario o email ya existe.';
        } else if (userResponse.status === 500) {
          errorMessage = 'Error interno del servidor.';
        }
        
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('Error al conectarse con el servidor. Verifique su conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-3xl shadow-2xl bg-white">
        {/* Header con gradiente mejorado */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 z-10 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Registro de Usuario</h1>
                <p className="text-white/90 text-lg">{steps[currentStep].description}</p>
              </div>
            </div>

            {/* Progress steps mejorados */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {steps.map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex items-center gap-3 min-w-fit">
                    <div className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 ${
                      i < currentStep 
                        ? 'bg-white text-emerald-600 shadow-lg' 
                        : i === currentStep
                        ? 'bg-white/20 text-white ring-2 ring-white/50 backdrop-blur-sm'
                        : 'bg-white/10 text-white/60'
                    }`}>
                      {i < currentStep ? <Check className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                      {i === currentStep && (
                        <div className="absolute -inset-1 bg-white/20 rounded-xl animate-pulse"></div>
                      )}
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold text-sm ${i <= currentStep ? 'text-white' : 'text-white/60'}`}>
                        {step.name}
                      </div>
                      <div className={`text-xs ${i <= currentStep ? 'text-white/80' : 'text-white/40'}`}>
                        Paso {i + 1} de {steps.length}
                      </div>
                    </div>
                  </div>
                  {i < steps.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-white/40 mx-2 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Content area mejorada */}
        <div className="p-8 bg-gray-50 max-h-[calc(95vh-200px)] overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            
            {/* Paso 1: Datos Personales */}
            {currentStep === 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Información Personal</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {label:'Nombres *', field:'name', icon: User, placeholder: 'Ej. Juan Carlos'},
                    {label:'Apellidos *', field:'last_name', icon: User, placeholder: 'Ej. Pérez García'},
                    {label:'Email *', field:'email', type:'email', icon: Mail, placeholder: 'ejemplo@correo.com'},
                    {label:'DNI *', field:'dni', icon: CreditCard, placeholder: '12345678'},
                    {label:'Fecha de Nacimiento', field:'birthdate', type:'date', icon: Calendar},
                    {label:'Teléfono', field:'cell_phone_number', icon: Phone, placeholder: '987654321'}
                  ].map(({label, field, type='text', icon: Icon, placeholder}) => (
                    <div key={field} className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Icon className="w-4 h-4 text-gray-500" />
                        {label}
                      </label>
                      <div className="relative">
                        <input
                          type={type}
                          placeholder={placeholder}
                          value={formData[field as keyof typeof formData] as string}
                          onChange={e => handleInputChange(field as keyof typeof formData, e.target.value)}
                          className={`w-full border-2 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-gray-400 ${
                            errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        />
                        {errors[field] && (
                          <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {errors[field]}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    Dirección
                  </label>
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-gray-400 resize-none"
                    placeholder="Ej. Av. Siempre Viva 742, San Isidro, Lima"
                  />
                </div>
              </div>
            )}

            {/* Paso 2: Facultad y Carrera */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Información Académica</h2>
                </div>
                
                {loadingFaculties ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
                      <p className="text-gray-600">Cargando facultades...</p>
                    </div>
                  </div>
                ) : faculties.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                      <p className="text-gray-600">No se pudieron cargar las facultades</p>
                      <button
                        onClick={fetchFaculties}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Reintentar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {faculties.map(f => (
                      <div
                        key={f.id}
                        className={`group rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                          formData.faculty_id === f.id 
                            ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20' 
                            : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50 hover:shadow-md'
                        }`}
                        onClick={() => {
                          handleInputChange('faculty_id', f.id);
                          // Limpiar carrera si se cambia de facultad
                          if (formData.faculty_id !== f.id) {
                            handleInputChange('career', '');
                          }
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`text-3xl p-3 rounded-xl transition-all ${
                            formData.faculty_id === f.id ? 'bg-white shadow-sm' : 'bg-gray-100 group-hover:bg-white group-hover:shadow-sm'
                          }`}>
                            {f.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 text-lg mb-2">{f.name}</h3>
                            <div className="space-y-2">
                              {f.careers && f.careers.length > 0 ? (
                                <select
                                  className={`w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all ${
                                    formData.faculty_id === f.id ? 'border-emerald-300 bg-white' : 'border-gray-200'
                                  }`}
                                  value={formData.faculty_id === f.id ? formData.career : ''}
                                  onChange={(e) => {
                                    handleInputChange('faculty_id', f.id);
                                    handleInputChange('career', e.target.value);
                                  }}
                                  disabled={formData.faculty_id !== f.id}
                                >
                                  <option value="">Selecciona una carrera</option>
                                  {f.careers.map((career, idx) => (
                                    <option key={idx} value={career}>{career}</option>
                                  ))}
                                </select>
                              ) : (
                                <div className="text-gray-500 text-sm p-3 bg-gray-100 rounded-xl">
                                  No hay carreras disponibles
                                </div>
                              )}
                            </div>
                            {formData.faculty_id === f.id && formData.career && (
                              <div className="flex items-center gap-2 mt-3 text-emerald-600">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-sm font-medium">Seleccionado: {formData.career}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Paso 3: Credenciales */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Credenciales de Acceso</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nombre de Usuario</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.user}
                        onChange={(e) => handleInputChange('user', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono transition-all"
                        placeholder="usuario123"
                      />
                      <User className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Rol</label>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span className="capitalize font-medium text-blue-800">{formData.role}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        placeholder="••••••••"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="flex items-center gap-1 text-red-600 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Código de Etiqueta</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.label_id}
                        onChange={(e) => handleInputChange('label_id', e.target.value)}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono transition-all"
                        placeholder="LBL123456"
                      />
                      <button
                        type="button"
                        onClick={() => handleInputChange('label_id', `LBL${Math.floor(100000 + Math.random() * 900000)}`)}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center gap-2 whitespace-nowrap shadow-lg hover:shadow-xl"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Generar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Resumen de información */}
                <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Resumen del Registro
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><strong>Nombre:</strong> {formData.name} {formData.last_name}</div>
                    <div><strong>Email:</strong> {formData.email}</div>
                    <div><strong>DNI:</strong> {formData.dni}</div>
                    <div><strong>Teléfono:</strong> {formData.cell_phone_number || 'No especificado'}</div>
                    <div><strong>Facultad:</strong> {faculties.find(f => f.id === formData.faculty_id)?.name || 'No seleccionada'}</div>
                    <div><strong>Carrera:</strong> {formData.career || 'No seleccionada'}</div>
                    <div><strong>Usuario:</strong> {formData.user}</div>
                    <div><strong>Label ID:</strong> {formData.label_id}</div>
                  </div>
                  {formData.address && (
                    <div className="mt-3 text-sm">
                      <strong>Dirección:</strong> {formData.address}
                    </div>
                  )}
                  {formData.birthdate && (
                    <div className="mt-1 text-sm">
                      <strong>Fecha de nacimiento:</strong> {new Date(formData.birthdate).toLocaleDateString('es-ES')}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation buttons mejorados */}
            <div className="flex justify-between items-center mt-8 p-6 bg-white rounded-2xl shadow-sm">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                ← Anterior
              </button>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{currentStep + 1}</span>
                <span>de</span>
                <span>{steps.length}</span>
              </div>

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed() || loading}
                  className="px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Completar Registro
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;