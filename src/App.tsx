import React from 'react';
import { FormEngine } from './components/FormEngine';
import { FormSchema } from './types/schema';
import { Mail, Lock, User, Globe, MessageSquare, Hash } from 'lucide-react';

const demoSchema: FormSchema = {
  tailwind: true,
  mode: 'onChange',
  debug: true,
  design: {
    className: 'max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100',
    inputClassName: 'transition-all duration-200 ease-in-out',
  },
  fields: {
    firstName: {
      type: 'text',
      label: 'First Name',
      placeholder: 'Enter your first name',
      tooltip: 'Your given name as it appears on official documents',
      validation: {
        required: true,
        minLength: 2,
      },
      autoFocus: true,
      leftIcon: <User className="w-5 h-5" />,
    },
    lastName: {
      type: 'text',
      label: 'Last Name',
      placeholder: 'Enter your last name',
      tooltip: 'Your family name or surname',
      validation: {
        required: true,
        minLength: 2,
      },
      leftIcon: <User className="w-5 h-5" />,
    },
    email: {
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      tooltip: 'We\'ll use this to send you important updates',
      validation: {
        required: true,
        pattern: 'email_strict',
        acceptedDomains: ['gmail.com', 'yahoo.com', 'outlook.com'],
      },
      helperText: 'We only accept Gmail, Yahoo, and Outlook emails',
      leftIcon: <Mail className="w-5 h-5" />,
    },
    password: {
      type: 'password',
      label: 'Password',
      placeholder: 'Create a secure password',
      tooltip: 'Must be at least 8 characters with mixed case, numbers, and symbols',
      showToggle: true,
      strengthPolicy: 'strong',
      validation: {
        required: true,
        minLength: 8,
      },
      leftIcon: <Lock className="w-5 h-5" />,
    },
    confirmPassword: {
      type: 'password',
      label: 'Confirm Password',
      placeholder: 'Confirm your password',
      tooltip: 'Must match your password exactly',
      validation: {
        required: true,
        matchField: 'password',
      },
      leftIcon: <Lock className="w-5 h-5" />,
    },
    age: {
      type: 'number',
      label: 'Age',
      placeholder: 'Enter your age',
      tooltip: 'You must be at least 18 years old to register',
      validation: {
        required: true,
        min: 18,
        max: 120,
      },
      leftIcon: <Hash className="w-5 h-5" />,
    },
    bio: {
      type: 'textarea',
      label: 'Bio',
      placeholder: 'Tell us about yourself...',
      tooltip: 'Share a brief description about yourself',
      validation: {
        maxLength: 500,
      },
      helperText: 'Maximum 500 characters',
      leftIcon: <MessageSquare className="w-5 h-5" />,
    },
    country: {
      type: 'select',
      label: 'Country',
      placeholder: 'Select your country',
      tooltip: 'Your country of residence',
      options: [
        'United States',
        'Canada',
        'United Kingdom',
        'Australia',
        'Germany',
        'France',
        'Japan',
        'Other',
      ],
      validation: {
        required: true,
      },
      leftIcon: <Globe className="w-5 h-5" />,
    },
    interests: {
      type: 'checkbox',
      label: 'Interests',
      tooltip: 'Select all topics that interest you',
      options: [
        'Technology',
        'Sports',
        'Music',
        'Art',
        'Travel',
        'Food',
      ],
      helperText: 'Select all that apply',
    },
    gender: {
      type: 'radio',
      label: 'Gender',
      tooltip: 'Optional demographic information',
      options: ['Male', 'Female', 'Other', 'Prefer not to say'],
      validation: {
        required: true,
      },
    },
    newsletter: {
      type: 'checkbox',
      label: 'Subscribe to our newsletter',
      tooltip: 'Get updates about new features and content',
      defaultValue: true,
    },
    otp: {
      type: 'otp',
      label: 'Verification Code',
      tooltip: 'Enter the 6-digit code sent to your email',
      length: 6,
      validation: {
        required: true,
      },
      onResend: () => {
        alert('OTP resent!');
      },
      visibleIf: (data) => !!data.email,
      helperText: 'Enter the 6-digit code sent to your email',
    },
    submit: {
      type: 'button',
      label: 'Create Account',
      buttonType: 'submit',
    },
  },
  onSubmit: (data) => {
    console.log('Form submitted:', data);
    alert('Form submitted successfully! Check console for data.');
  },
  onError: (errors) => {
    console.log('Form errors:', errors);
  },
  onChange: (fieldName, value) => {
    console.log(`Field ${fieldName} changed:`, value);
  },
};

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            React Form Engine
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ultra-powerful, schema-based form engine with intelligent validation, 
            conditional logic, and beautiful modern design
          </p>
        </div>
        
        <FormEngine schema={demoSchema} />
        
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
              </div>
              Features Implemented
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Schema-based configuration with TypeScript
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Real-time validation with debouncing
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Conditional field logic (visibleIf)
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Password strength validation
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Field matching (confirm password)
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                OTP input with resend functionality
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Modern UI with tooltips and icons
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Debug mode with state logging
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              </div>
              NPM Package Ready
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Modular architecture with clean exports
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                TypeScript definitions included
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Tree-shakeable components
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Zero external dependencies
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Headless design for customization
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Plugin system for extensions
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Production-ready performance
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Comprehensive documentation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;