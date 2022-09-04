Devices
    - 1 = Central
    - 2 = Largada
    - 3 = Chegada

Operations
    • Central
        - 1 = Conexão
    • Largada
        - 1 Conexão
        - 2 RFID
        - 3 RTC
        - 4 Interruptor
    • Chegada
        - 1 Conexão
        - 2 RFID
        - 3 RTC
        - 4 Interruptor

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