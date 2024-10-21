class OpenAIService
    require 'httparty'
  
    BASE_URL = 'https://api.openai.com/v1/engines/davinci-codex/completions'
  
    def initialize(api_key)
      @api_key = api_key
    end
  
    def generate_form(prompt)
      response = HTTParty.post(
        BASE_URL,
        headers: {
          'Content-Type' => 'application/json',
          'Authorization' => "Bearer #{@api_key}"
        },
        body: {
          prompt: prompt,
          max_tokens: 150
        }.to_json
      )
      JSON.parse(response.body)
    end
  end