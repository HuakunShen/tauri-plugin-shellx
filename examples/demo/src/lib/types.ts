export type Block = {
    type: 'input' | 'output' | 'error',
    stdout: string,
    stderr: string,
    status?: number
}