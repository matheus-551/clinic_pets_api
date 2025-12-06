import ApiError from "./ApiError.js";

export function mapDbError(e) {
  if (e.code === "ECONNREFUSED" || e.code === "ER_ACCESS_DENIED_ERROR" || e.code === "ER_BAD_DB_ERROR") {
    return new ApiError(503, "Erro de conexão com o banco de dados");
  }

  if (e.code === "ER_DUP_ENTRY") {
    return new ApiError(400, "Registro duplicado");
  }

  if (e.code === "ER_BAD_NULL_ERROR") {
    return new ApiError(400, "Campo obrigatório não pode ser nulo");
  }

  if (e.code === "ER_NO_REFERENCED_ROW_2") {
    return new ApiError(400, "Violação de chave estrangeira");
  }

  // fallback genérico
  return new ApiError(500, "Um erro inesperado aconteceu. Tente novamente");
}
