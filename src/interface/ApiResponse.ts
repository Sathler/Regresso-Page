type ApiResponse = (Record<string, number> & {x_points: number[], y_points: number[]}) & { expression?: string }

export default ApiResponse