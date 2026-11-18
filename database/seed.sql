USE caixinha_do_bem;

INSERT INTO doadores (nome, telefone, email) VALUES
('Ana Clara Souza', '(14) 99123-4567', 'ana@email.com'),
('Carlos Eduardo Lima', '(14) 99876-5432', NULL);

INSERT INTO itens (nome, categoria) VALUES
('Cesta Básica', 'Alimentos'),
('Kit de Higiene', 'Higiene'),
('Cobertor', 'Vestuário');

INSERT INTO doacoes (doador_id, item_id, quantidade, observacao) VALUES
(1, 1, 2, 'Entregue na sede');
