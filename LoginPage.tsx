import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';

// ── cn utility ──
function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}

// ── UI Components ──

function Button({
  className,
  variant,
  size,
  disabled,
  children,
  ...props
}: React.ComponentProps<'button'> & {
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}) {
  const variantClasses: Record<string, string> = {
    default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
    outline: 'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-white shadow-xs hover:bg-destructive/90',
    secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };
  const sizeClasses: Record<string, string> = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md px-3',
    lg: 'h-10 rounded-md px-6',
    icon: 'size-9',
  };

  return (
    <button
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        variantClasses[variant ?? 'default'],
        sizeClasses[size ?? 'default'],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      className={cn(
        'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}

function Label({ className, children, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      className={cn(
        'text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
    />
  );
}

function InputError({ message, className }: { message?: string; className?: string }) {
  return message ? (
    <p className={cn('text-sm text-red-600 dark:text-red-400', className)}>
      {message}
    </p>
  ) : null;
}

function PasswordInput({ className, ...props }: Omit<React.ComponentProps<'input'>, 'type'>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input type={show ? 'text' : 'password'} className={cn('pr-10', className)} {...props} />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-3 text-muted-foreground hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none"
        tabIndex={-1}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

// ── Auth Layout ──

function AuthLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-4">
            <a href="/" className="flex flex-col items-center gap-2 font-medium">
              <img
                src="/Nestle-Logo.png"
                alt="Nestlé"
                className="h-16 w-auto object-contain brightness-0 dark:invert"
              />
            </a>
            <div className="space-y-2 text-center">
              <h1 className="text-xl font-medium">{title}</h1>
              <p className="text-center text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  LOGIN PAGE  —  paste this into your project
// ═══════════════════════════════════════════════

type Props = {
  status?: string;
  canRegister?: boolean;
  onLogin?: (email: string, password: string) => void;
  errors?: { email?: string; password?: string };
  flash?: { status?: string };
};

export default function LoginPage({
  status,
  canRegister = true,
  onLogin,
  errors: propErrors,
  flash,
}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);
  const [localErrors, setLocalErrors] = useState<{ email?: string; password?: string }>({});

  const errors = propErrors || localErrors;
  const displayStatus = status || flash?.status;
  const isPendingApproval = displayStatus?.includes('pending admin approval');
  const isAdminApproved = displayStatus?.includes('Admin approved success');
  const loginError = errors?.email;
  const isPendingLoginError = loginError?.includes('pending admin approval');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin) {
      setProcessing(true);
      try {
        await onLogin(email, password);
      } finally {
        setProcessing(false);
      }
    }
  };

  // ── Approved state ──
  if (isAdminApproved) {
    return (
      <AuthLayout title="Account Approved!" description="Your account has been approved by admin">
        <div className="flex flex-col items-center justify-center gap-6 py-8">
          <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
            <svg className="h-12 w-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Account Approved Successfully!</h2>
            <p className="max-w-md text-sm text-gray-600 dark:text-gray-400">{displayStatus}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">You can now log in with your credentials.</p>
          </div>
          <Button onClick={() => window.location.reload()} className="gap-2">Proceed to Login</Button>
        </div>
      </AuthLayout>
    );
  }

  // ── Pending approval state ──
  if (isPendingApproval || isPendingLoginError) {
    return (
      <AuthLayout title="Account Pending Approval" description="Your account is waiting for admin approval">
        <div className="flex flex-col items-center justify-center gap-6 py-8">
          <div className="rounded-full bg-yellow-100 p-4 dark:bg-yellow-900">
            <svg className="h-12 w-12 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Account Pending Approval</h2>
            <p className="max-w-md text-sm text-gray-600 dark:text-gray-400">{displayStatus || loginError}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Please wait for an administrator to approve your account before logging in.</p>
          </div>
          <Button onClick={() => window.location.reload()} className="gap-2" variant="outline">
            <ArrowLeft className="h-4 w-4" /> Go back to Login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  // ── Login form ──
  return (
    <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              required
              autoFocus
              tabIndex={1}
              autoComplete="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputError message={errors.email} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              required
              tabIndex={2}
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputError message={errors.password} />
          </div>

          <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
            {processing && <Spinner />} Log in
          </Button>
        </div>

        {canRegister && (
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a
              href="/register"
              tabIndex={5}
              className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current dark:decoration-neutral-500"
            >
              Sign up
            </a>
          </div>
        )}
      </form>

      {displayStatus && !isPendingApproval && !isAdminApproved && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">{displayStatus}</div>
      )}
    </AuthLayout>
  );
}
