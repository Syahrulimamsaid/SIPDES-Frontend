import { Toast } from "../components/ui/alert/Toast";

type TCatchHandle = {
    err: unknown;
    variant?: "warning" | "error" | "info" | "success";
}

export function catchHandle({ err, variant = "warning" }: TCatchHandle) {
    let message = "Internal Server Error";

    if (err instanceof Error) {
        message = err.message;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = err as any;

    if (error?.response?.data?.message) {
        message = error.response.data.message;
    }

    Toast({
        message,
        variant: variant,
    });
}