import {
  ASTNodeKind,
  Document,
  Statement,
  TypeDeclaration,
  DeriveDeclaration,
  CallDeclaration,
} from './ast'

export const format = (document: Document) => {
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
    case ASTNodeKind.CallDeclaration:
      return -2
  }
}
