import React, { useState, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Save, 
    Upload, 
    Shield, 
    User, 
    Lock, 
    Mail, 
    Phone, 
    Briefcase, 
    DollarSign, 
    Calendar, 
    Eye, 
    EyeOff, 
    CreditCard, 
    MapPin, 
    Share2, 
    FileText, 
    CheckCircle2, 
    AlertCircle,
    Building2,
    Percent
} from 'lucide-react';

export default function Edit({ employee, availableRoles = [], availableDepartments = [] }) {
    const avatarInputRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(employee.avatar || '');
    const [showPassword, setShowPassword] = useState(false);

    const departments = availableDepartments.length > 0 ? availableDepartments : [
        'Engineering',
        'Cyber Security',
        'Mobile Development',
        'Cloud & DevOps',
        'UI/UX Design',
        'Sales & Growth',
        'Management',
        'HR & Accounts'
    ];

    const defaultRole = employee.system_role || availableRoles[0]?.name || 'Developer';

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        prefix: employee.prefix || 'Mr',
        first_name: employee.first_name || (employee.name ? employee.name.split(' ')[0] : ''),
        last_name: employee.last_name || (employee.name ? employee.name.split(' ').slice(1).join(' ') : ''),
        name: employee.name || '',
        username: employee.username || '',
        email: employee.email || '',
        phone: employee.phone || '',
        alternate_phone: employee.alternate_phone || '',
        family_phone: employee.family_phone || '',
        designation: employee.designation || '',
        department: employee.department || 'Engineering',
        status: employee.status || 'active',
        salary: employee.salary || '',
        sales_commission_percentage: employee.sales_commission_percentage || '',
        max_sales_discount_percent: employee.max_sales_discount_percent || '',
        joined_date: employee.joined_date ? employee.joined_date.substring(0, 10) : '',
        dob: employee.dob ? employee.dob.substring(0, 10) : '',
        gender: employee.gender || '',
        marital_status: employee.marital_status || '',
        blood_group: employee.blood_group || '',
        avatar: employee.avatar || '',
        avatar_file: null,
        facebook_link: employee.facebook_link || '',
        twitter_link: employee.twitter_link || '',
        social_media_1: employee.social_media_1 || '',
        social_media_2: employee.social_media_2 || '',
        custom_field_1: employee.custom_field_1 || '',
        custom_field_2: employee.custom_field_2 || '',
        custom_field_3: employee.custom_field_3 || '',
        custom_field_4: employee.custom_field_4 || '',
        guardian_name: employee.guardian_name || '',
        id_proof_name: employee.id_proof_name || 'National ID (NID)',
        id_proof_number: employee.id_proof_number || '',
        permanent_address: employee.permanent_address || '',
        current_address: employee.current_address || '',
        bank_account_holder_name: employee.bank_account_holder_name || '',
        bank_account_number: employee.bank_account_number || '',
        bank_name: employee.bank_name || '',
        bank_identifier_code: employee.bank_identifier_code || '',
        bank_branch: employee.bank_branch || '',
        tax_payer_id: employee.tax_payer_id || '',
        allow_login: !!employee.user_id,
        system_role: defaultRole,
        password: '',
        password_confirmation: '',
    });

    const handleAvatarSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar_file', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/admin/employees/${employee.id}`, {
            forceFormData: true,
        });
    };

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

    return (
        <AdminLayout title={`Edit ${employee.name}`}>
            <div className="max-w-6xl mx-auto space-y-6 pb-16">
                
                {/* Top Action & Breadcrumb Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
                            <Link href="/admin" className="hover:text-blue-600">Dashboard</Link>
                            <span>/</span>
                            <Link href="/admin/employees" className="hover:text-blue-600">Staff Team</Link>
                            <span>/</span>
                            <span className="text-slate-900 font-bold">Edit Member</span>
                        </div>
                        <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight flex items-center gap-2.5">
                            <span>Edit Team Member: {employee.name}</span>
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Update comprehensive personal, role, job credentials, and financial details
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 self-start sm:self-auto">
                        <Link
                            href="/admin/employees"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-2xs"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Staff List</span>
                        </Link>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </div>

                {/* Error Banner */}
                {Object.keys(errors).length > 0 && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 space-y-1 text-xs">
                        <div className="flex items-center gap-2 font-bold text-sm">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span>Please resolve the following errors:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 pl-2 text-[11px]">
                            {Object.entries(errors).map(([key, err]) => (
                                <li key={key}><strong className="capitalize">{key.replace('_', ' ')}:</strong> {err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* SECTION 1: BASIC INFORMATION */}
                    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                    <User className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 className="font-extrabold text-sm text-slate-900">1. Basic Information</h2>
                                    <p className="text-[11px] text-slate-400">Personal names, identity, and profile avatar</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                            {/* Avatar Picker */}
                            <div className="md:col-span-3 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-center">
                                <div 
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="w-24 h-24 rounded-2xl bg-white border-2 border-dashed border-slate-300 hover:border-blue-500 flex items-center justify-center cursor-pointer transition-all overflow-hidden shadow-2xs group relative"
                                    title="Click to select profile picture"
                                >
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-blue-600">
                                            <Upload className="w-6 h-6 mb-1" />
                                            <span className="text-[10px] font-bold">Upload Photo</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={avatarInputRef}
                                    accept="image/*"
                                    onChange={handleAvatarSelect}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                                >
                                    {avatarPreview ? 'Change Photo' : 'Browse Avatar'}
                                </button>
                                <span className="text-[10px] text-slate-400">JPG, PNG or WEBP (Max 4MB)</span>
                            </div>

                            {/* Name & Primary Fields */}
                            <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Prefix</label>
                                    <select
                                        value={data.prefix}
                                        onChange={(e) => setData('prefix', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:bg-white focus:border-blue-500"
                                    >
                                        <option value="Mr">Mr.</option>
                                        <option value="Mrs">Mrs.</option>
                                        <option value="Miss">Miss.</option>
                                        <option value="Dr">Dr.</option>
                                        <option value="Engr">Engr.</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">First Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        placeholder="e.g. Tanvir"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        placeholder="e.g. Ahmed"
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:border-blue-500"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="email"
                                            required
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="tanvir@company.com"
                                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Member Status</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:border-blue-500"
                                    >
                                        <option value="active">Active</option>
                                        <option value="on_leave">On Leave</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: ROLES AND PERMISSIONS (LOGIN ACCESS) */}
                    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 className="font-extrabold text-sm text-slate-900">2. Roles and Permissions</h2>
                                    <p className="text-[11px] text-slate-400">System login authorization and RBAC role assignment</p>
                                </div>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                                <input
                                    type="checkbox"
                                    checked={data.allow_login}
                                    onChange={(e) => setData('allow_login', e.target.checked)}
                                    className="rounded text-blue-600 focus:ring-0 w-4 h-4"
                                />
                                <span className="font-bold text-xs text-slate-800">Allow Login</span>
                            </label>
                        </div>

                        {data.allow_login ? (
                            <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Username (Optional)</label>
                                    <input
                                        type="text"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        placeholder="Leave blank to use email"
                                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-blue-500 font-mono"
                                    />
                                    <span className="text-[10px] text-slate-400 mt-0.5 block">Used for custom login alias</span>
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">System Role *</label>
                                    <select
                                        value={data.system_role}
                                        onChange={(e) => setData('system_role', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold focus:border-blue-500"
                                    >
                                        {availableRoles.map(role => (
                                            <option key={role.id} value={role.name}>{role.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">New Password (Optional)</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Leave blank to keep current"
                                            className="w-full pr-8 pl-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-xs focus:border-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-700 font-bold mb-1">Confirm New Password</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Repeat new password"
                                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-xs focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                                This member does not have login permissions. Check <strong>Allow Login</strong> above to grant access.
                            </p>
                        )}
                    </div>

                    {/* SECTION 3: JOB & COMPENSATION */}
                    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
                        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                <Briefcase className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="font-extrabold text-sm text-slate-900">3. Job, Department & Sales Commission</h2>
                                <p className="text-[11px] text-slate-400">Position designations, department, payroll salary, and commission rate</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Department *</label>
                                <select
                                    value={data.department}
                                    onChange={(e) => setData('department', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:bg-white focus:border-blue-500"
                                >
                                    {departments.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Designation *</label>
                                <input
                                    type="text"
                                    required
                                    value={data.designation}
                                    onChange={(e) => setData('designation', e.target.value)}
                                    placeholder="e.g. Lead Software Architect"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Joined Date</label>
                                <input
                                    type="date"
                                    value={data.joined_date}
                                    onChange={(e) => setData('joined_date', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Monthly Salary (৳ BDT)</label>
                                <div className="relative">
                                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="number"
                                        value={data.salary}
                                        onChange={(e) => setData('salary', e.target.value)}
                                        placeholder="e.g. 65000"
                                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold font-mono focus:bg-white focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Sales Commission Percentage (%)</label>
                                <div className="relative">
                                    <Percent className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.sales_commission_percentage}
                                        onChange={(e) => setData('sales_commission_percentage', e.target.value)}
                                        placeholder="e.g. 5.00"
                                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium font-mono focus:bg-white focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Max Sales Discount Percent (%)</label>
                                <div className="relative">
                                    <Percent className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.max_sales_discount_percent}
                                        onChange={(e) => setData('max_sales_discount_percent', e.target.value)}
                                        placeholder="e.g. 10.00"
                                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium font-mono focus:bg-white focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: MORE INFORMATION (PERSONAL, CONTACT, SOCIAL, ID PROOFS, ADDRESS) */}
                    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
                        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="font-extrabold text-sm text-slate-900">4. More Information (Personal, Contacts, ID & Address)</h2>
                                <p className="text-[11px] text-slate-400">Emergency numbers, birth date, blood group, social media, and verified identity</p>
                            </div>
                        </div>

                        {/* Personal Demographics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    value={data.dob}
                                    onChange={(e) => setData('dob', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Gender</label>
                                <select
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                                >
                                    <option value="">Please Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Marital Status</label>
                                <select
                                    value={data.marital_status}
                                    onChange={(e) => setData('marital_status', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-blue-500"
                                >
                                    <option value="">Please Select</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Blood Group</label>
                                <select
                                    value={data.blood_group}
                                    onChange={(e) => setData('blood_group', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:border-blue-500"
                                >
                                    <option value="">Please Select</option>
                                    {bloodGroups.map(bg => (
                                        <option key={bg} value={bg}>{bg}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Phone Contacts */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs pt-1">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Mobile Number (Primary)</label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="017XXXXXXXX"
                                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Alternate Contact Number</label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={data.alternate_phone}
                                        onChange={(e) => setData('alternate_phone', e.target.value)}
                                        placeholder="018XXXXXXXX"
                                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Family / Emergency Number</label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={data.family_phone}
                                        onChange={(e) => setData('family_phone', e.target.value)}
                                        placeholder="019XXXXXXXX"
                                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs pt-1">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Facebook Link</label>
                                <input
                                    type="url"
                                    value={data.facebook_link}
                                    onChange={(e) => setData('facebook_link', e.target.value)}
                                    placeholder="https://facebook.com/..."
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Twitter / X Link</label>
                                <input
                                    type="url"
                                    value={data.twitter_link}
                                    onChange={(e) => setData('twitter_link', e.target.value)}
                                    placeholder="https://x.com/..."
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Social Media 1 (LinkedIn/GitHub)</label>
                                <input
                                    type="url"
                                    value={data.social_media_1}
                                    onChange={(e) => setData('social_media_1', e.target.value)}
                                    placeholder="https://linkedin.com/in/..."
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Social Media 2 (Portfolio / Other)</label>
                                <input
                                    type="url"
                                    value={data.social_media_2}
                                    onChange={(e) => setData('social_media_2', e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Custom Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs pt-1">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Custom Field 1</label>
                                <input
                                    type="text"
                                    value={data.custom_field_1}
                                    onChange={(e) => setData('custom_field_1', e.target.value)}
                                    placeholder="Custom field 1"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Custom Field 2</label>
                                <input
                                    type="text"
                                    value={data.custom_field_2}
                                    onChange={(e) => setData('custom_field_2', e.target.value)}
                                    placeholder="Custom field 2"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Custom Field 3</label>
                                <input
                                    type="text"
                                    value={data.custom_field_3}
                                    onChange={(e) => setData('custom_field_3', e.target.value)}
                                    placeholder="Custom field 3"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Custom Field 4</label>
                                <input
                                    type="text"
                                    value={data.custom_field_4}
                                    onChange={(e) => setData('custom_field_4', e.target.value)}
                                    placeholder="Custom field 4"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Guardian & ID Proofs */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs pt-1">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Guardian Name</label>
                                <input
                                    type="text"
                                    value={data.guardian_name}
                                    onChange={(e) => setData('guardian_name', e.target.value)}
                                    placeholder="Father / Mother / Spouse Name"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">ID Proof Document Name</label>
                                <select
                                    value={data.id_proof_name}
                                    onChange={(e) => setData('id_proof_name', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:bg-white focus:border-blue-500"
                                >
                                    <option value="National ID (NID)">National ID (NID)</option>
                                    <option value="Passport">Passport</option>
                                    <option value="Driving License">Driving License</option>
                                    <option value="Birth Certificate">Birth Certificate</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">ID Proof Document Number</label>
                                <input
                                    type="text"
                                    value={data.id_proof_number}
                                    onChange={(e) => setData('id_proof_number', e.target.value)}
                                    placeholder="e.g. 199XXXXXXXXXXXX"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Addresses */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs pt-1">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Permanent Address</label>
                                <textarea
                                    rows={2}
                                    value={data.permanent_address}
                                    onChange={(e) => setData('permanent_address', e.target.value)}
                                    placeholder="Village/Road, Thana, District, Division"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Current / Present Address</label>
                                <textarea
                                    rows={2}
                                    value={data.current_address}
                                    onChange={(e) => setData('current_address', e.target.value)}
                                    placeholder="House/Apartment, Street, City"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 5: BANK DETAILS */}
                    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
                        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="font-extrabold text-sm text-slate-900">5. Bank Details (Payroll & Accounts)</h2>
                                <p className="text-[11px] text-slate-400">Bank account, routing numbers, and TIN tax identifier</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Account Holder's Name</label>
                                <input
                                    type="text"
                                    value={data.bank_account_holder_name}
                                    onChange={(e) => setData('bank_account_holder_name', e.target.value)}
                                    placeholder="e.g. Tanvir Ahmed"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Account Number</label>
                                <input
                                    type="text"
                                    value={data.bank_account_number}
                                    onChange={(e) => setData('bank_account_number', e.target.value)}
                                    placeholder="e.g. 150XXXXXXXXXX"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Bank Name</label>
                                <input
                                    type="text"
                                    value={data.bank_name}
                                    onChange={(e) => setData('bank_name', e.target.value)}
                                    placeholder="e.g. Dutch-Bangla Bank / BRAC Bank / bKash"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Bank Identifier Code (Routing / Swift)</label>
                                <input
                                    type="text"
                                    value={data.bank_identifier_code}
                                    onChange={(e) => setData('bank_identifier_code', e.target.value)}
                                    placeholder="e.g. 090XXXXXXXX"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Branch Name</label>
                                <input
                                    type="text"
                                    value={data.bank_branch}
                                    onChange={(e) => setData('bank_branch', e.target.value)}
                                    placeholder="e.g. Banani Branch"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Tax Payer ID (TIN / NID)</label>
                                <input
                                    type="text"
                                    value={data.tax_payer_id}
                                    onChange={(e) => setData('tax_payer_id', e.target.value)}
                                    placeholder="e.g. 847XXXXXXXXX"
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Save Bar */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                        <Link
                            href="/admin/employees"
                            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Saving Changes...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
