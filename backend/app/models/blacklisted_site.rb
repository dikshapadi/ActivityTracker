class BlacklistedSite < ApplicationRecord
    validates :url, presence: true, uniqueness: true
end
