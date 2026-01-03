export async function asyncHandler<T>(
  promise: Promise<T>
): Promise<{ data?: T; error?: unknown }> {
  try {
    const data = await promise
    return { data }
  } catch (error) {
    return { error }
  }
}

