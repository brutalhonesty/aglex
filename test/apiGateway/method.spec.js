import { AWS, Promise, check, expect, sinon } from '../helper'
import target, * as lib from '../../src/lib/apiGateway/method'

const stub = {
  Integration: class {
    static create () {}
    update () {}
  },
  MethodResponse: class {
    static create () {}
    update () {}
  }
}
target.__Rewire__('integration', () => stub.Integration)
target.__Rewire__('methodResponse', () => stub.MethodResponse)

describe('method', () => {
  const apiGateway = new AWS.APIGateway()
  const RestApi = class {}
  const restApi = new RestApi()
  const Resource = class {}
  const resource = new Resource()
  const Method = lib.method(apiGateway)
  const sb = sinon.sandbox.create()
  let method

  before(() => {
    restApi.id = '12345abcde'
    resource.id = '123abc'
    resource._restApi = restApi
  })

  beforeEach(() => {
    method = new Method(resource, {
      httpMethod: 'GET'
    })
  })

  afterEach(() => {
    sb.restore()
  })

  it('should be a function', () => {
    expect(lib.method).to.be.a('function')
  })

  it('should return Method class', () => {
    expect(Method).to.be.a('function')
    expect(Method.name).to.equal('Method')
  })

  describe('Method.create', () => {
    it('should return promise object', () => {
      sb.stub(apiGateway, 'putMethodAsync')
        .returns(new Promise(() => {}))
      const ret = Method.create(resource, {httpMethod: 'GET'})

      expect(ret).to.be.an.instanceof(Promise)
    })

    it('should resolve with new Method object', (done) => {
      sb.stub(apiGateway, 'putMethodAsync')
        .returns(Promise.resolve({httpMethod: 'GET'}))
      const ret = Method.create(resource, {httpMethod: 'GET'})

      ret.done((data) => check(done, () => {
        expect(data).to.deep.equal({
          _resource: resource,
          httpMethod: 'GET'
        })
      }))
    })
  })

  describe('constructor', () => {
    it('should generate a valid object', () => {
      expect(method._resource).to.equal(resource)
      expect(method).to.have.property('httpMethod', 'GET')
    })

    it('should set Integration object if methodIntegration exists', () => {
      const method = new Method(resource, {
        httpMethod: 'GET',
        methodIntegration: {}
      })
      expect(method.methodIntegration).to.be.an.instanceof(stub.Integration)
    })

    it('should set MethodResponse objects if methodResponses exists', () => {
      const method = new Method(resource, {
        httpMethod: 'GET',
        methodResponses: {
          '200': {},
          '500': {}
        }
      })
      expect(method.methodResponses).to.have.property('200')
      expect(method.methodResponses['200']).to.be.an.instanceof(stub.MethodResponse)
      expect(method.methodResponses).to.have.property('500')
      expect(method.methodResponses['500']).to.be.an.instanceof(stub.MethodResponse)
    })
  })

  describe('createIntegration', () => {
    it('should return promise object', () => {
      sb.stub(stub.Integration, 'create')
        .returns(new Promise(() => {}))
      const ret = method.createIntegration({})

      expect(ret).to.be.an.instanceof(Promise)
    })

    it('should set methodIntegration after resolved', (done) => {
      sb.stub(stub.Integration, 'create')
        .returns(Promise.resolve(new stub.Integration()))
      const ret = method.createIntegration({})

      ret.done(() => check(done, () => {
        expect(method.methodIntegration).to.be.an.instanceof(stub.Integration)
      }))
    })
  })

  describe('createMethodResponse', () => {
    it('should return promise object', () => {
      sb.stub(stub.MethodResponse, 'create')
        .returns(new Promise(() => {}))
      const ret = method.createMethodResponse({statusCode: '200'})

      expect(ret).to.be.an.instanceof(Promise)
    })

    it('should set methodResponses after resolved', (done) => {
      sb.stub(stub.MethodResponse, 'create')
        .returns(Promise.resolve(new stub.MethodResponse()))
      const ret = method.createMethodResponse({statusCode: '200'})

      ret.done(() => check(done, () => {
        expect(method.methodResponses).to.have.property('200')
        expect(method.methodResponses['200']).to.be.an.instanceof(stub.MethodResponse)
      }))
    })

    it('should append new methodResponses to current object', (done) => {
      method.methodResponses = {
        '200': new stub.MethodResponse()
      }
      sb.stub(stub.MethodResponse, 'create')
        .returns(Promise.resolve(new stub.MethodResponse()))
      const ret = method.createMethodResponse({statusCode: '500'})

      ret.done(() => check(done, () => {
        expect(method.methodResponses).to.have.property('200')
        expect(method.methodResponses['200']).to.be.an.instanceof(stub.MethodResponse)
        expect(method.methodResponses).to.have.property('500')
        expect(method.methodResponses['500']).to.be.an.instanceof(stub.MethodResponse)
      }))
    })
  })

  describe('delete', () => {
    it('should return promise object', () => {
      sb.stub(apiGateway, 'deleteMethodAsync')
        .returns(new Promise(() => {}))
      const ret = method.delete({})

      expect(ret).to.be.an.instanceof(Promise)
    })
  })

  describe('updateIntegration', () => {
    it('should return promise object', () => {
      method.methodIntegration = new stub.Integration()
      sb.stub(method.methodIntegration, 'update')
        .returns(new Promise(() => {}))
      const ret = method.updateIntegration({})

      expect(ret).to.be.an.instanceof(Promise)
    })
  })

  describe('updateMethodResponse', () => {
    it('should return promise object', () => {
      method.methodResponses = {
        '200': new stub.MethodResponse()
      }
      sb.stub(method.methodResponses['200'], 'update')
        .returns(new Promise(() => {}))
      const ret = method.updateMethodResponse({statusCode: '200'})

      expect(ret).to.be.an.instanceof(Promise)
    })
  })
})
