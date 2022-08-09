Devices
    - 1 = Central
    - 2 = Largada
    - 3 = Chegada

Operations
    • Central
        - 1 = Conexão 
        - 2 = RFID
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

JSON de retorno
{
    device: x,
    operation: y,
    status: z, // 1 = Ok, 0 = Erro
    message: "Your message here",
    data: {
        // Caso o status for 0, "data" vai ter apenas o atributo "message"
    } 
}

JSON de envio
{
    device: x,
    operation: y
}