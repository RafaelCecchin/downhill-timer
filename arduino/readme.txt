Devices
    - 1 = Central
    - 2 = Largada
    - 3 = Chegada

Mode
    • 1 Normal
    • 2 Teste

Operations
    • Central
        - 1 Teste de conexão
        - 5 Atualizar modo (normal/teste)
    • Largada
        - 1 Teste de conexão
        - 2 Teste de RFID e identificar piloto durante a corrida
        - 3 Teste de RTC
        - 4 Teste de interruptor
        - 5 Atualizar modo (normal/teste)
    • Chegada
        - 1 Teste de conexão
        - 2 Teste de RFID e identificar piloto durante a corrida
        - 3 Teste de RTC
        - 4 Teste de interruptor
        - 5 Atualizar modo (normal/teste)

Replace tags
[NOME_COMPETIDOR]

JSON de retorno
{
    device: x,
    operation: y,
    status: z, // 1 = Ok, 0 = Erro
    message: "Sua mensagem aqui",
    data: {
		"time": "Y-m-d h:i:s"
    }
}

JSON de envio
{
    device: x,
    operation: y,
    data: {
        "time": "Y-m-d h:i:s"
    }
}