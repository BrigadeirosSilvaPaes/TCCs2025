<?php
session_start();
require_once "conexao.php";

if ($_POST) {
    $database = new Database();
    $db = $database->getConnection();
    
    // Use o nome correto do campo do formulário
    $email_matricula = $_POST['matricula']; // Alterado para 'matricula'
    $senha = $_POST['senha'];
    
    // Verificar se é professor
    if (strpos($email_matricula, '@educar.rs.gov.br') !== false) {
        $query = "SELECT * FROM professores WHERE email = :email";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":email", $email_matricula);
        $stmt->execute();
        
        if ($stmt->rowCount() == 1) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (password_verify($senha, $row['senha'])) {
                $_SESSION['user_id'] = $row['id'];
                $_SESSION['user_type'] = 'professor';
                $_SESSION['user_name'] = $row['nome'];
                $_SESSION['turma'] = $row['turma'];
                header("Location: professor_dashboard.php");
                exit();
            }
        }
    } 
    // Verificar se é aluno
    else {
        $query = "SELECT * FROM alunos WHERE matricula = :matricula";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":matricula", $email_matricula);
        $stmt->execute();
        
        if ($stmt->rowCount() == 1) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (password_verify($senha, $row['senha'])) {
                $_SESSION['user_id'] = $row['id'];
                $_SESSION['user_type'] = 'aluno';
                $_SESSION['user_name'] = $row['nome'];
                $_SESSION['turma'] = $row['turma'];
                header("Location: homeA.html"); // Ou aluno_dashboard.php
                exit();
            }
        }
    }
    
    $_SESSION['error'] = "Credenciais inválidas!";
    header("Location: login.html"); // Redirecionar de volta para o login
    exit();
} else {
    // Se não for POST, redirecionar para login
    header("Location: login.html");
    exit();
}
?>