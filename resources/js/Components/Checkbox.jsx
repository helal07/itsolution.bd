export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'h-4 w-4 rounded-md border-neutral-300 text-primary shadow-xs focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-colors ' +
                className
            }
        />
    );
}
