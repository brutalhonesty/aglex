import { AWS, Promise, check, expect, sinon } from '../helper'
import * as lib from '../../src/lib/apiGateway/integrationResponse'

describe('integrationResponse', () => {
  const apiGateway = new AWS.APIGateway()
  const RestApi = class {}
  const restApi = new RestApi()
  const Resource = class {}
  const resource = new Resource()
  const Method = class {}
  const method = new Method()
  const Integration = class {}
  const integration = new Integration()
  const IntegrationResponse = lib.integrationResponse(apiGateway)
  const integrationResponse = new IntegrationResponse(integration, {
    statusCode: '200'
  })
  const sb = sinon.sandbox.create()

  before(() => {
    restApi.id = '12345abcde'
    resource.id = '123abc'
    resource._restApi = restApi
    method.httpMethod = 'GET'
    method._resource = resource
    integration._method = method
  })

  afterEach(() => {
    sb.restore()
  })

  it('should be a function', () => {
    expect(lib.integrationResponse).to.be.a('function')
  })

  it('should return IntegrationResponse class', () => {
    expect(IntegrationResponse).to.be.a('function')
    expect(IntegrationResponse.name).to.equal('IntegrationResponse')
  })

  describe('IntegrationResponse.create', () => {
    it('should return promise object', () => {
      sb.stub(apiGateway, 'putIntegrationResponseAsync')
        .returns(new Promise(() => {}))
      const ret = IntegrationResponse.create(integration, {statusCode: '200'})

      expect(ret).to.be.an.instanceof(Promise)
    })

    it('should resolve with new IntegrationResponse object', (done) => {
      sb.stub(apiGateway, 'putIntegrationResponseAsync')
        .returns(Promise.resolve({statusCode: '200'}))
      const ret = IntegrationResponse.create(integration, {statusCode: '200'})

      ret.done((data) => check(done, () => {
        expect(data).to.deep.equal({
          _integration: integration,
          statusCode: '200'
        })
      }))
    })
  })

  describe('constructor', () => {
    it('should generate a valid object', () => {
      expect(integrationResponse._integration).to.equal(integration)
      expect(integrationResponse).to.have.property('statusCode', '200')
    })
  })

  describe('delete', () => {
    it('should return promise object', () => {
      sb.stub(apiGateway, 'deleteIntegrationResponseAsync')
        .returns(new Promise(() => {}))
      const ret = integrationResponse.delete({})

      expect(ret).to.be.an.instanceof(Promise)
    })
  })

  describe('update', () => {
    it('should return promise object', () => {
      sb.stub(apiGateway, 'deleteIntegrationResponseAsync')
        .returns(new Promise(() => {}))
      const ret = integrationResponse.update({})

      expect(ret).to.be.an.instanceof(Promise)
    })

    it('should delete old data and create new data', (done) => {
      sb.stub(apiGateway, 'deleteIntegrationResponseAsync')
        .returns(Promise.resolve())
      sb.stub(apiGateway, 'putIntegrationResponseAsync')
        .returns(Promise.resolve({'200': {}}))
      const ret = integrationResponse.update({})

      ret.done((data) => check(done, () => {
        expect(data).to.be.an.instanceof(IntegrationResponse)
        expect(apiGateway.deleteIntegrationResponseAsync).to.have.been.calledOnce
        expect(apiGateway.putIntegrationResponseAsync).to.have.been.calledOnce
      }))
    })
  })
})
