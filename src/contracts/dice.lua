-- very import 
COCOS_ACCURACY = 100000

function init()
    assert(chainhelper:is_owner(),'no auth')
    read_list = {public_data={rate=true,max_bet=true}}
    chainhelper:read_chain()
    public_data.rate  = 98
    public_data.max_bet = 1000000 
	write_list = {public_data={rate=true,max_bet=true}}
	chainhelper:write_chain()
end


function bet(num, amount)
    read_list = {public_data={rate=true,max_bet=true}}
    chainhelper:read_chain()

    num = tonumber(num)
    amount = tonumber(amount) * COCOS_ACCURACY

    assert( 1 < num and num < 97, "num must in [2,96] " )
    assert( 0 < amount and amount < public_data.max_bet * COCOS_ACCURACY, "amount must in [1, max]")

    chainhelper:transfer_from_caller(contract_base_info.owner, amount, 'COCOS', true)

    result_num = chainhelper:random() % 100

    if result_num < num then
        win_chance = num - 1
        reward_ratio = public_data.rate*1.0/win_chance
        reward = amount*reward_ratio
        chainhelper:transfer_from_owner(contract_base_info.caller, reward, 'COCOS', true)
    end
end

function hello_world()
	chainhelper:log('hello world')
	chainhelper:log(date('%Y-%m-%dT%H:%M:%S', chainhelper:time()))
end