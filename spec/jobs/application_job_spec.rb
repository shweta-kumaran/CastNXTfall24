# spec/jobs/application_job_spec.rb

require 'rails_helper'

RSpec.describe ApplicationJob, type: :job do
  describe 'Inheritance' do
    it 'inherits from ActiveJob::Base' do
      expect(described_class < ActiveJob::Base).to be true
    end
  end
end
