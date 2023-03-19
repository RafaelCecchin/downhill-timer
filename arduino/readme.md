# Documentação da API

## Devices
    • 1 = Central
    • 2 = Largada
    • 3 = Chegada

## Operations
    • Central
        - 1 = Teste de conexão
    • Largada
        - 1 = Teste de conexão
        - 2 = Teste de RFID e identificar piloto durante a corrida
        - 3 = Teste de RTC e atualização de hora
        - 4 = Teste de interruptor
    • Chegada
        - 1 = Teste de conexão
        - 2 = Teste de RFID e identificar piloto durante a corrida
        - 3 = Teste de RTC e atualização de hora
        - 4 = Teste de interruptor

## Status
    • 0 = Erro
    • 1 = Ok

## Replace tags
    • [NOME_COMPETIDOR]

## JSON de envio
```json
{
    device: x,
    operation: y,
    data: {
        //"dateTime": "Y-m-d h:i:s"
    }
}
```

## JSON de retorno
```json
{
    device: x,
    operation: y,
    status: z,
    message: "Your message here",
    data: {
		//"dateTime": "Y-m-d h:i:s",
        //"rfid": XXXXX
    }
}
```

####
---

## Exemplos de uso

### Teste de conexão no dispositivo central

Ao clicar em "Testar Conexão Serial" nas configurações do sistema, o seguinte JSON é enviado para a interface serial selecionada:
```json
{
    device: 1,
    operation: 1
}
```

Caso o embarcado tenha recebido a solicitação, deve retornar o seguinte JSON:
```json
{
    device: 1,
    operation: 1,
    status: 1,
    message: "Conexão realizada com sucesso."
}
```

O sistema vai esperar a resposta durante alguns segundos e, caso não obtenha retorno, vai informar o erro de timeout. Caso obtenha retorno, vai informar o valor preenchido no campo "message".

### Teste de RTC e atualização de hora

Ao clicar em "Testar RTC e atualizar hora" nas configurações do sistema para o dispositivo de chegada, o seguinte JSON é enviado para a interface serial selecionada:
```json
{
    device: 3,
    operation: 3,
    data: {
        "dateTime": "2023-03-19 11:07:23" // Exemplo*
    }
}
```

Caso o embarcado tenha recebido a solicitação, deve retornar o seguinte JSON:
```json
{
    device: 3,
    operation: 3,
    status: 1,
    message: "A data e hora identificada foi 2023-03-19 11:07:23"
}
```

O sistema vai esperar a resposta durante alguns segundos e, caso não obtenha retorno, vai informar o erro de timeout. Caso obtenha retorno, vai informar o valor preenchido no campo "message".

### Teste de RFID

Ao clicar em "Testar RFID" nas configurações do sistema para o dispositivo de largada, o seguinte JSON é enviado para a interface serial selecionada:
```json
{
    device: 2,
    operation: 2
}
```

Caso o embarcado tenha recebido a solicitação, ao aproximar uma tag do leitor RFID ele deve retornar o seguinte JSON:
```json
{
    device: 2,
    operation: 2,
    status: 1,
    message: "Competidor 34434 identificado com sucesso.",
    data: {
        "rfid": 34434
    }
}
```

*Obs: os dispositivos de largada e de chegada devem estar preparados a todo momento para enviar dados sobre TAGS identificadas em seus leitores RFID. A estrutura do JSON segue a mesma da apresentada anteriormente, mas pode ser utilizado a tag de substituição [NOME_COMPETIDOR] no campo "message", da seguinte forma:

```json
{
    device: 2,
    operation: 2,
    status: 1,
    message: "Competidor [NOME_COMPETIDOR] identificado com sucesso.",
    data: {
        "rfid": 34434
    }
}
```

Desta forma, quando o sistema for apresentar na tela o log de registros recebidos via API serial, a tag [NOME_COMPETIDOR] será substituida pelo nome do competidor correspondente a tag especificada no campo "rfid".