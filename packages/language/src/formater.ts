import {
  ASTNodeKind,
  Document,
  Statement,
  TypeDeclaration,
  DeriveDeclaration,
  CallDeclaration,
  ImportStatement,
  ExportStatement,
} from './ast'

export const format = (document: Document) => {
  const formatExportStatement = (
    exportStatement: ExportStatement
  ): ExportStatement => {
    return exportStatement
  }
  const formatImportStatement = (
    importStatement: ImportStatement
  ): ImportStatement => {
    return importStatement
  }

  const formatCallDeclaration = (
    callDeclaration: CallDeclaration
  ): CallDeclaration => {
    return callDeclaration
  }

  const formatDeriveDeclaration = (
    deriveDeclaration: DeriveDeclaration
  ): DeriveDeclaration => {
    return deriveDeclaration
  }

  const formatTypeDeclaration = (
    typeDeclaration: TypeDeclaration
  ): TypeDeclaration => {
    return typeDeclaration
  }

  const formatStatement = (statement: Statement): Statement => {
    switch (statement.kind) {
      case ASTNodeKind.TypeDeclaration:
        return formatTypeDeclaration(statement)
      case ASTNodeKind.DeriveDeclaration:
        return formatDeriveDeclaration(statement)
      case ASTNodeKind.CallDeclaration:
        return formatCallDeclaration(statement)
      case ASTNodeKind.ImportStatement:
        return formatImportStatement(statement)
      case ASTNodeKind.ExportStatement:
        return formatExportStatement(statement)
    }
  }

  const formatDocument = (document: Document): Document => {
    document.statements = document.statements
      .map(formatStatement)
      .sort((a, b) => getStatementValue(a) - getStatementValue(b))
    return document
  }

  return formatDocument(document)
}

function getStatementValue(statement: Statement) {
  switch (statement.kind) {
    case ASTNodeKind.TypeDeclaration:
      return 2
    case ASTNodeKind.DeriveDeclaration:
      return 1
    case ASTNodeKind.ExportStatement:
      return -1
    case ASTNodeKind.ImportStatement:
      return 3
    case ASTNodeKind.CallDeclaration:
      return -2
  }
}
